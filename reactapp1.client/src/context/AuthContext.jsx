import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      // Decode JWT to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] })
      } catch {
        logout()
      }
    }
    setLoading(false)
  }, [token])

  const login = (newToken) => {
    localStorage.setItem('jwt_token', newToken)
    setToken(newToken)
    const payload = JSON.parse(atob(newToken.split('.')[1]))
    setUser({ username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] })
    // Clear browser history to prevent back navigation to login
    window.history.replaceState(null, '', '/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('jwt_token')
    setToken('')
    setUser(null)
    // Clear history and redirect to login
    window.history.replaceState(null, '', '/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
