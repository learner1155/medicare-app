using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProtectedController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetSecret()
        {
            var username = User.Identity?.Name ?? "Unknown";
            return Ok(new 
            { 
                success = true,
                message = $"Hello {username}! This is protected data that requires authentication.",
                user = username
            });
        }
    }
}
