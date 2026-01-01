using System.Collections.Concurrent;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        // In production, store users in a database
        private static readonly ConcurrentDictionary<string, string> Users = new()
        {
            ["user"] = PasswordHelper.HashPassword("Password123!")
        };

        private static readonly RsaCryptoService RsaService = new();
        
        // Rate limiting: track failed login attempts per IP
        private static readonly ConcurrentDictionary<string, (int Count, DateTime LastAttempt)> FailedAttempts = new();
        private const int MaxFailedAttempts = 5;
        private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(15);

        // JWT Configuration - In production, store in appsettings.json or secrets
        private static readonly string JwtSecretKey = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        private const string JwtIssuer = "ReactApp1";
        private const string JwtAudience = "ReactApp1Client";
        private static readonly TimeSpan JwtExpiration = TimeSpan.FromHours(1);

        [HttpGet("publickey")]
        public IActionResult GetPublicKey()
        {
            return Ok(new { publicKey = RsaService.GetPublicKeyPem() });
        }

        [HttpPost]
        public IActionResult Login([FromBody] HybridLoginRequest request)
        {
            var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            
            // Check rate limiting
            if (IsLockedOut(clientIp))
            {
                return StatusCode(429, new { success = false, message = "Too many failed attempts. Please try again later." });
            }

            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Invalid input." });

            string username, password;
            try
            {
                var aesKeyB64 = Encoding.UTF8.GetString(RsaService.DecryptToBytes(request.EncryptedAesKey));
                var aesIVB64 = Encoding.UTF8.GetString(RsaService.DecryptToBytes(request.EncryptedAesIV));
                var aesKey = Convert.FromBase64String(aesKeyB64);
                var aesIV = Convert.FromBase64String(aesIVB64);

                if (aesKey.Length != 16 && aesKey.Length != 24 && aesKey.Length != 32)
                    throw new CryptographicException("AES key is not a valid size.");
                if (aesIV.Length != 16)
                    throw new CryptographicException("AES IV is not a valid size.");

                username = AesHelper.Decrypt(request.EncryptedUsername, aesKey, aesIV);
                password = AesHelper.Decrypt(request.EncryptedPassword, aesKey, aesIV);
            }
            catch
            {
                RecordFailedAttempt(clientIp);
                return BadRequest(new { success = false, message = "Invalid encrypted credentials." });
            }

            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                RecordFailedAttempt(clientIp);
                return BadRequest(new { success = false, message = "Username and password are required." });
            }

            if (Users.TryGetValue(username, out var storedHash) && PasswordHelper.VerifyPassword(password, storedHash))
            {
                // Clear failed attempts on successful login
                FailedAttempts.TryRemove(clientIp, out _);
                
                // Generate JWT token
                var token = GenerateJwtToken(username);
                
                return Ok(new LoginResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token
                });
            }
            
            RecordFailedAttempt(clientIp);
            return Unauthorized(new { success = false, message = "Invalid credentials" });
        }

        private static string GenerateJwtToken(string username)
        {
            var securityKey = new SymmetricSecurityKey(Convert.FromBase64String(JwtSecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new []
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.NameIdentifier, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer: JwtIssuer,
                audience: JwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.Add(JwtExpiration),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static bool IsLockedOut(string clientIp)
        {
            if (FailedAttempts.TryGetValue(clientIp, out var attempt))
            {
                if (attempt.Count >= MaxFailedAttempts && DateTime.UtcNow - attempt.LastAttempt < LockoutDuration)
                {
                    return true;
                }
                if (DateTime.UtcNow - attempt.LastAttempt >= LockoutDuration)
                {
                    FailedAttempts.TryRemove(clientIp, out _);
                }
            }
            return false;
        }

        private static void RecordFailedAttempt(string clientIp)
        {
            FailedAttempts.AddOrUpdate(
                clientIp,
                (1, DateTime.UtcNow),
                (_, existing) => (existing.Count + 1, DateTime.UtcNow)
            );
        }
    }

    public class HybridLoginRequest
    {
        [Required]
        public string EncryptedAesKey { get; set; } = string.Empty;
        [Required]
        public string EncryptedAesIV { get; set; } = string.Empty;
        [Required]
        public string EncryptedUsername { get; set; } = string.Empty;
        [Required]
        public string EncryptedPassword { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }

    // Secure password hashing using PBKDF2 (built-in .NET)
    public static class PasswordHelper
    {
        private const int SaltSize = 16;
        private const int HashSize = 32;
        private const int Iterations = 100000;

        public static string HashPassword(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(SaltSize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                Iterations,
                HashAlgorithmName.SHA256,
                HashSize
            );
            
            // Combine salt and hash: salt(16) + hash(32) = 48 bytes
            var combined = new byte[SaltSize + HashSize];
            Buffer.BlockCopy(salt, 0, combined, 0, SaltSize);
            Buffer.BlockCopy(hash, 0, combined, SaltSize, HashSize);
            
            return Convert.ToBase64String(combined);
        }

        public static bool VerifyPassword(string password, string storedHash)
        {
            var combined = Convert.FromBase64String(storedHash);
            if (combined.Length != SaltSize + HashSize)
                return false;
            
            var salt = new byte[SaltSize];
            var storedHashBytes = new byte[HashSize];
            Buffer.BlockCopy(combined, 0, salt, 0, SaltSize);
            Buffer.BlockCopy(combined, SaltSize, storedHashBytes, 0, HashSize);
            
            var computedHash = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                Iterations,
                HashAlgorithmName.SHA256,
                HashSize
            );
            
            return CryptographicOperations.FixedTimeEquals(computedHash, storedHashBytes);
        }
    }

    public class RsaCryptoService
    {
        private readonly RSA _rsa;
        private readonly string _publicKeyPem;

        public RsaCryptoService()
        {
            _rsa = RSA.Create(2048);
            _publicKeyPem = ExportPublicKeyPem(_rsa);
        }

        public string GetPublicKeyPem() => _publicKeyPem;

        // Using OAEP padding (more secure than PKCS#1 v1.5)
        public byte[] DecryptToBytes(string base64Cipher)
        {
            var cipherBytes = Convert.FromBase64String(base64Cipher);
            return _rsa.Decrypt(cipherBytes, RSAEncryptionPadding.OaepSHA256);
        }

        private static string ExportPublicKeyPem(RSA rsa)
        {
            var pubKey = rsa.ExportSubjectPublicKeyInfo();
            var base64 = Convert.ToBase64String(pubKey);
            var sb = new StringBuilder();
            sb.AppendLine("-----BEGIN PUBLIC KEY-----");
            for (int i = 0; i < base64.Length; i += 64)
                sb.AppendLine(base64.Substring(i, Math.Min(64, base64.Length - i)));
            sb.AppendLine("-----END PUBLIC KEY-----");
            return sb.ToString();
        }
    }

    public static class AesHelper
    {
        public static string Decrypt(string base64CipherText, byte[] key, byte[] iv)
        {
            var cipherBytes = Convert.FromBase64String(base64CipherText);
            using var aes = Aes.Create();
            aes.Key = key;
            aes.IV = iv;
            using var decryptor = aes.CreateDecryptor();
            var plainBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);
            return Encoding.UTF8.GetString(plainBytes);
        }
    }
}
