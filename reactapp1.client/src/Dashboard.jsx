import { useEffect } from 'react'
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Appointments from './pages/Appointments'
import Contact from './pages/Contact'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Prevent browser back button from navigating away from dashboard
  useEffect(() => {
    // Push a new entry to history to prevent going back
    window.history.pushState(null, '', window.location.href)
    
    const handlePopState = (event) => {
      // Push state again to prevent navigation
      window.history.pushState(null, '', window.location.href)
      // Optionally navigate to dashboard home
      navigate('/dashboard', { replace: true })
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [navigate])

  // Prevent leaving page without logout (optional: show confirmation)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <div className="dashboard-layout">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid px-3 px-lg-5">
          <NavLink className="navbar-brand d-flex align-items-center" to="/dashboard">
            <i className="fas fa-hospital me-2"></i>
            <span className="fw-bold">MediCare</span>
          </NavLink>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <NavLink to="/dashboard" end className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`}>
                  <i className="fas fa-home me-1"></i> Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dashboard/appointments" className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`}>
                  <i className="fas fa-calendar-check me-1"></i> Appointments
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dashboard/services" className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`}>

                  <i className="fas fa-stethoscope me-1"></i> Services
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dashboard/about" className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`}>
                  <i className="fas fa-info-circle me-1"></i> About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dashboard/contact" className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`}>

                  <i className="fas fa-envelope me-1"></i> Contact
                </NavLink>
              </li>
            </ul>
            
            <div className="d-flex align-items-center">
              <div className="dropdown">
                <button className="btn btn-outline-light dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                  <div className="user-avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                    <i className="fas fa-user text-white small"></i>
                  </div>
                  <span className="d-none d-md-inline">{user?.username || 'User'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text">
                      <small className="text-muted">Signed in as</small><br />
                      <strong>{user?.username || 'User'}</strong>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={logout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="main-content">
        <div className="container-fluid px-3 px-lg-5 py-4">
          <Routes>
            <Route index element={<Home />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="services" element={<Services />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="footer bg-dark text-white py-4 mt-auto">
        <div className="container-fluid px-3 px-lg-5">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <i className="fas fa-hospital me-2"></i>
              <span className="fw-bold">MediCare</span>
              <span className="text-muted ms-2">© 2024 All rights reserved</span>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
