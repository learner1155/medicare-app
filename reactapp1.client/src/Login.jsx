import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import './Login.css'

// Helper: AES encrypt (returns base64 ciphertext)
async function aesEncrypt(plainText, key, iv) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plainText)
  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    data
  )
  return window.btoa(String.fromCharCode(...new Uint8Array(cipherBuffer)))
}

// Helper: base64 encode Uint8Array
function uint8ArrayToBase64(arr) {
  return window.btoa(String.fromCharCode(...arr))
}

// Helper: Import RSA public key from PEM for OAEP encryption
async function importPublicKey(pem) {
  const pemHeader = '-----BEGIN PUBLIC KEY-----'
  const pemFooter = '-----END PUBLIC KEY-----'
  const pemContents = pem.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '')
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))
  return await window.crypto.subtle.importKey(
    'spki',
    binaryDer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  )
}

// Helper: RSA-OAEP encrypt
async function rsaEncrypt(data, publicKey) {
  const encoded = new TextEncoder().encode(data)
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encoded
  )
  return window.btoa(String.fromCharCode(...new Uint8Array(encrypted)))
}

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [publicKey, setPublicKey] = useState(null)
  const { login } = useAuth()

  // Clear forward history on login page to prevent navigating forward to dashboard
  useEffect(() => {
    // Replace current history state to clear any forward entries
    window.history.replaceState(null, '', window.location.href)
  }, [])

  useEffect(() => {
    fetch('/api/login/publickey')
      .then(res => res.json())
      .then(async data => {
        const key = await importPublicKey(data.publicKey)
        setPublicKey(key)
      })
      .catch(() => setError('Failed to load security keys'))
  }, [])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!publicKey) {
      setError('Security keys not loaded. Please refresh.')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const aesKeyRaw = window.crypto.getRandomValues(new Uint8Array(32))
      const aesIV = window.crypto.getRandomValues(new Uint8Array(16))
      const aesKey = await window.crypto.subtle.importKey(
        'raw',
        aesKeyRaw,
        { name: 'AES-CBC' },
        false,
        ['encrypt']
      )

      const encryptedUsername = await aesEncrypt(form.username, aesKey, aesIV)
      const encryptedPassword = await aesEncrypt(form.password, aesKey, aesIV)
      const encryptedAesKey = await rsaEncrypt(uint8ArrayToBase64(aesKeyRaw), publicKey)
      const encryptedAesIV = await rsaEncrypt(uint8ArrayToBase64(aesIV), publicKey)

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptedAesKey,
          encryptedAesIV,
          encryptedUsername,
          encryptedPassword
        })
      })

      const data = await res.json()

      if (data.success && data.token) {
        login(data.token)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="container-fluid h-100">
        <div className="row h-100 g-0">
          <div className="col-lg-6 d-none d-lg-flex login-left">
            <div className="login-left-content">
              <div className="brand text-center mb-5">
                <div className="brand-icon">
                  <i className="fas fa-hospital fa-4x"></i>
                </div>
                <h1 className="display-4 fw-bold">MediCare</h1>
                <p className="fs-5">Your Health, Our Priority</p>
              </div>
              <div className="features">
                <div className="feature">
                  <span className="feature-icon"><i className="fas fa-user-doctor fa-2x"></i></span>
                  <div>
                    <h5 className="fw-semibold">Expert Doctors</h5>
                    <p className="mb-0">Access to qualified healthcare professionals</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon"><i className="fas fa-calendar-check fa-2x"></i></span>
                  <div>
                    <h5 className="fw-semibold">Easy Appointments</h5>
                    <p className="mb-0">Book appointments with just a few clicks</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon"><i className="fas fa-shield-alt fa-2x"></i></span>
                  <div>
                    <h5 className="fw-semibold">Secure & Private</h5>
                    <p className="mb-0">Your health data is protected with encryption</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center login-right">
            <div className="login-form-container w-100">
              <div className="text-center mb-4 d-lg-none">
                <i className="fas fa-hospital fa-3x text-primary mb-3"></i>
                <h2 className="fw-bold">MediCare</h2>
              </div>
              
              <h2 className="fw-bold mb-2">Welcome Back</h2>
              <p className="text-muted mb-4">Sign in to access your dashboard</p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className="form-control"
                      placeholder="Enter your username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-lock"></i></span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}
                
                <button type="submit" className="btn btn-primary w-100 py-3" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>Sign In
                    </>
                  )}
                </button>
              </form>
              
              <div className="demo-credentials mt-4">
                <p className="text-muted small mb-2">
               <i className="fas fa-info-circle me-1"></i>Demo credentials:
              </p>
             <code className="d-block">user / Password123!</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
