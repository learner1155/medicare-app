import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  const stats = [
    { icon: 'fa-calendar-check', value: '12', label: 'Upcoming Appointments', color: 'primary tillcolor' },
    { icon: 'fa-user-doctor', value: '8', label: 'Available Doctors', color: 'success' },
    { icon: 'fa-pills', value: '24', label: 'Prescriptions', color: 'info' },
    { icon: 'fa-file-medical', value: '156', label: 'Medical Records', color: 'warning' }
  ]

  const upcomingAppointments = [
    { doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'Dec 28, 2024', time: '10:00 AM', status: 'confirmed', icon: 'fa-heart-pulse' },
    { doctor: 'Dr. Michael Chen', specialty: 'General Physician', date: 'Dec 30, 2024', time: '2:30 PM', status: 'pending', icon: 'fa-stethoscope' },
    { doctor: 'Dr. Emily Williams', specialty: 'Dermatologist', date: 'Jan 02, 2025', time: '11:00 AM', status: 'confirmed', icon: 'fa-hand-dots' }
  ]

  const recentActivity = [
    { icon: 'fa-circle-check', iconColor: 'success', text: 'Appointment confirmed with Dr. Johnson', time: '2 hours ago' },
    { icon: 'fa-file-lines', iconColor: 'info', text: 'Lab results uploaded', time: '5 hours ago' },
    { icon: 'fa-prescription-bottle-medical', iconColor: 'primary', text: 'Prescription renewed', time: '1 day ago' },
    { icon: 'fa-calendar-plus', iconColor: 'warning', text: 'New appointment scheduled', time: '2 days ago' }
  ]

  return (
    <div className="page">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h2 fw-bold text-dark mb-1">
            Welcome back, {user?.username || 'User'}! 
            <i className="fas fa-hand text-warning ms-2"></i>
          </h1>
          <p className="text-muted mb-0">Here's what's happening with your health today</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 g-lg-4 mb-4">
        {stats.map((stat, index) => (
          <div className="col-6 col-lg-3" key={index}>
            <div className="card shadow-sm h-100">
              <div className="card-body p-3 p-lg-4">
                <div className="d-flex align-items-center">
                  <div className={`stat-icon-wrapper bg-${stat.color} bg-opacity-10 rounded-3 me-3`}>
                    <i className={`fas ${stat.icon} fa-lg fa-fw text-${stat.color}`}></i>
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <h3 className="h2 fw-bold mb-0 text-dark">{stat.value}</h3>
                    <p className="text-muted mb-0 small text-truncate">{stat.label}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="row g-3 g-lg-4">
        {/* Upcoming Appointments */}
        <div className="col-12 col-xl-7">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">
                  <i className="fas fa-calendar-alt text-primary me-2"></i>
                  Upcoming Appointments
                </h5>
                <button className="btn btn-sm btn-outline-primary">
                  <i className="fas fa-arrow-right me-1"></i>View All
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              {upcomingAppointments.map((apt, index) => (
                <div className={`p-3 ${index !== upcomingAppointments.length - 1 ? 'border-bottom' : ''}`} key={index}>
                  <div className="row align-items-center g-2">
                    <div className="col-auto">
                      <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center" 
                           style={{width: '48px', height: '48px'}}>
                        <i className={`fas ${apt.icon} text-white`}></i>
                      </div>
                    </div>
                    <div className="col">
                      <h6 className="mb-0 fw-semibold text-dark">{apt.doctor}</h6>
                      <small className="text-muted">{apt.specialty}</small>
                    </div>
                    <div className="col-auto d-none d-sm-block text-end">
                      <div className="small text-dark fw-medium">
                        <i className="fas fa-calendar-day text-muted me-1"></i>{apt.date}
                      </div>
                      <div className="small text-muted">
                        <i className="fas fa-clock me-1"></i>{apt.time}
                      </div>
                    </div>
                    <div className="col-auto">
                      <span className={`badge bg-${apt.status === 'confirmed' ? 'success' : 'warning'} bg-opacity-10 text-${apt.status === 'confirmed' ? 'success' : 'warning'} px-3 py-2`}>
                        <i className={`fas fa-${apt.status === 'confirmed' ? 'check' : 'clock'} me-1`}></i>
                        <span className="d-none d-md-inline">{apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-12 col-xl-5">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-semibold">
                <i className="fas fa-clock-rotate-left text-info me-2"></i>
                Recent Activity
              </h5>
            </div>
            <div className="card-body p-0">
              {recentActivity.map((activity, index) => (
                <div className={`d-flex align-items-start p-3 ${index !== recentActivity.length - 1 ? 'border-bottom' : ''}`} key={index}>
                  <div className={`bg-${activity.iconColor} bg-opacity-10 rounded d-flex align-items-center justify-content-center me-3 flex-shrink-0`}
                       style={{width: '40px', height: '40px'}}>
                    <i className={`fas ${activity.icon} text-${activity.iconColor}`}></i>
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <p className="mb-1 small text-dark">{activity.text}</p>
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>{activity.time}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
