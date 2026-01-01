import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Contact() {
  const { token } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setStatus({ type: '', message: '' })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setStatus({ type: 'success', message: 'Message sent successfully!' })
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to send message.' })
      }
    } catch {
      setStatus({ type: 'error', message: 'An error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: 'fa-location-dot', title: 'Address', details: '123 Medical Center Drive, Healthcare City, HC 12345', color: 'danger' },
    { icon: 'fa-phone', title: 'Phone', details: '(555) 123-4567', color: 'success' },
    { icon: 'fa-envelope', title: 'Email', details: 'info@medicare.com', color: 'primary' },
    { icon: 'fa-clock', title: 'Hours', details: 'Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-5PM', color: 'warning' }
  ]

  return (
    <div className="page">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h2 fw-bold text-dark mb-1">Contact Us</h1>
          <p className="text-muted mb-0">We're here to help. Reach out with any questions.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Contact Info */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="fas fa-address-card text-primary me-2"></i>Get in Touch
              </h5>
              <p className="text-muted small mb-4">
                Have questions about our services? Our team is ready to assist you.
              </p>
              {contactInfo.map((info, index) => (
                <div className="d-flex align-items-start mb-3" key={index}>
                  <div className={`bg-${info.color} bg-opacity-10 rounded d-flex align-items-center justify-content-center me-3 flex-shrink-0`}
                       style={{width: '40px', height: '40px'}}>
                    <i className={`fas ${info.icon} text-${info.color}`}></i>
                  </div>
                  <div>
                    <h6 className="small fw-semibold mb-1">{info.title}</h6>
                    <p className="text-muted small mb-0">{info.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="fas fa-paper-plane text-primary me-2"></i>Send a Message
              </h5>
              
              {status.message && (
                <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'} py-2`}>
                  <i className={`fas fa-${status.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
                  {status.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Your Name</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-user text-muted"></i></span>
                      <input type="text" name="name" className="form-control" placeholder="John Doe" value={form.name} onChange={handleChange} required disabled={loading} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-medium">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-envelope text-muted"></i></span>
                      <input type="email" name="email" className="form-control" placeholder="john@example.com" value={form.email} onChange={handleChange} required disabled={loading} />
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label small fw-medium">Subject</label>
                  <select name="subject" className="form-select" value={form.subject} onChange={handleChange} required disabled={loading}>
                    <option value="">Select a subject...</option>
                    <option value="appointment">Appointment Inquiry</option>
                    <option value="billing">Billing Question</option>
                    <option value="services">Services Information</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label small fw-medium">Message</label>
                  <textarea name="message" className="form-control" rows="4" placeholder="How can we help you?" value={form.message} onChange={handleChange} required disabled={loading}></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                  ) : (
                    <><i className="fas fa-paper-plane me-2"></i>Send Message</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
