import { useState } from 'react'

export default function Appointments() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ doctor: '', date: '', time: '', reason: '' })

  const appointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'Dec 28, 2024', time: '10:00 AM', status: 'confirmed', icon: 'fa-heart-pulse' },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'General Physician', date: 'Dec 30, 2024', time: '2:30 PM', status: 'pending', icon: 'fa-stethoscope' },
    { id: 3, doctor: 'Dr. Emily Williams', specialty: 'Dermatologist', date: 'Jan 02, 2025', time: '11:00 AM', status: 'confirmed', icon: 'fa-hand-dots' }
  ]

  const doctors = [
    'Dr. Sarah Johnson - Cardiologist',
    'Dr. Michael Chen - General Physician',
    'Dr. Emily Williams - Dermatologist',
    'Dr. James Wilson - Pediatrician',
    'Dr. Amanda Roberts - Neurologist'
  ]

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    alert('Appointment request submitted!')
    setShowModal(false)
    setForm({ doctor: '', date: '', time: '', reason: '' })
  }

  return (
    <div className="page">
      {/* Page Header */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="h2 fw-bold text-dark mb-1">Appointments</h1>
          <p className="text-muted mb-0">Manage your upcoming and past appointments</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus me-2"></i>New Appointment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <a className="nav-link active" href="#"><i className="fas fa-calendar-alt me-1"></i>Upcoming</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#"><i className="fas fa-history me-1"></i>Past</a>
        </li>
      </ul>

      {/* Appointments List */}
      <div className="row g-3">
        {appointments.map(apt => (
          <div className="col-12" key={apt.id}>
            <div className="card shadow-sm">
              <div className="card-body p-3 p-md-4">
                <div className="row align-items-center g-3">
                  <div className="col-auto">
                    <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center"
                         style={{width: '50px', height: '50px'}}>
                      <i className={`fas ${apt.icon} text-white`}></i>
                    </div>
                  </div>
                  <div className="col">
                    <h6 className="fw-semibold mb-0 text-dark">{apt.doctor}</h6>
                    <small className="text-muted">{apt.specialty}</small>
                  </div>
                  <div className="col-auto d-none d-md-block">
                    <div className="text-end">
                      <div className="small fw-medium text-dark">
                        <i className="fas fa-calendar-day text-muted me-1"></i>{apt.date}
                      </div>
                      <div className="small text-muted">
                        <i className="fas fa-clock me-1"></i>{apt.time}
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <span className={`badge bg-${apt.status === 'confirmed' ? 'success' : 'warning'} px-3 py-2`}>
                      <i className={`fas fa-${apt.status === 'confirmed' ? 'check' : 'clock'} me-1`}></i>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </div>
                  <div className="col-12 col-md-auto">
                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="fas fa-edit me-1"></i><span className="d-none d-sm-inline">Reschedule</span>
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="fas fa-times me-1"></i><span className="d-none d-sm-inline">Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-semibold">
                  <i className="fas fa-calendar-plus text-primary me-2"></i>Book Appointment
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-medium">Select Doctor</label>
                    <select name="doctor" className="form-select" value={form.doctor} onChange={handleChange} required>
                      <option value="">Choose a doctor...</option>
                      {doctors.map((doc, i) => <option key={i} value={doc}>{doc}</option>)}
                    </select>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-medium">Date</label>
                      <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} required />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-medium">Time</label>
                      <select name="time" className="form-select" value={form.time} onChange={handleChange} required>
                        <option value="">Select...</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-medium">Reason for Visit</label>
                    <textarea name="reason" className="form-control" rows="3" placeholder="Describe your symptoms..." value={form.reason} onChange={handleChange} required></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-check me-1"></i>Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
