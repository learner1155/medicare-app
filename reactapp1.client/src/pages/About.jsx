export default function About() {
  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Chief Medical Officer', specialty: 'Cardiology', experience: '15+ years', icon: 'fa-heart-pulse' },
    { name: 'Dr. Michael Chen', role: 'Head of Surgery', specialty: 'General Surgery', experience: '12+ years', icon: 'fa-user-doctor' },
    { name: 'Dr. Emily Williams', role: 'Senior Physician', specialty: 'Internal Medicine', experience: '10+ years', icon: 'fa-stethoscope' },
    { name: 'Dr. James Wilson', role: 'Pediatric Specialist', specialty: 'Pediatrics', experience: '8+ years', icon: 'fa-baby' }
  ]

  const values = [
    { icon: 'fa-heart', title: 'Compassionate Care', description: 'We treat every patient with empathy, understanding, and respect.', color: 'danger' },
    { icon: 'fa-microscope', title: 'Medical Excellence', description: 'Our team stays at the forefront of medical research and technology.', color: 'primary' },
    { icon: 'fa-handshake', title: 'Patient-Centered', description: 'Your health goals and preferences guide every decision we make.', color: 'success' },
    { icon: 'fa-star', title: 'Continuous Improvement', description: 'We constantly evolve our practices to provide the best care.', color: 'warning' }
  ]

  const stats = [
    { value: '25+', label: 'Years of Service', color: 'primary' },
    { value: '50,000+', label: 'Patients Served', color: 'success' },
    { value: '100+', label: 'Medical Staff', color: 'info' },
    { value: '98%', label: 'Satisfaction Rate', color: 'warning' }
  ]

  return (
    <div className="page">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h2 fw-bold text-dark mb-1">About MediCare</h1>
          <p className="text-muted mb-0">Providing exceptional healthcare services since 1995</p>
        </div>
      </div>

      {/* Our Story */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-3">
            <i className="fas fa-book-open text-primary me-2"></i>Our Story
          </h4>
          <p className="text-muted mb-3">
            MediCare was founded with a simple mission: to provide accessible, high-quality healthcare 
            to everyone. Over the past three decades, we have grown from a small clinic to a 
            comprehensive healthcare network serving thousands of patients annually.
          </p>
          <p className="text-muted mb-0">
            Our state-of-the-art facilities are equipped with the latest medical technology, 
            and our team of dedicated healthcare professionals is committed to delivering 
            personalized care that addresses your unique health needs.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {stats.map((stat, index) => (
          <div className="col-6 col-lg-3" key={index}>
            <div className="card shadow-sm text-center h-100">
              <div className="card-body py-4">
                <h2 className={`display-6 fw-bold text-${stat.color} mb-1`}>{stat.value}</h2>
                <p className="text-muted mb-0 small">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Core Values */}
      <h4 className="fw-bold mb-3">
        <i className="fas fa-gem text-info me-2"></i>Our Core Values
      </h4>
      <div className="row g-3 mb-4">
        {values.map((value, index) => (
          <div className="col-12 col-sm-6 col-xl-3" key={index}>
            <div className="card shadow-sm h-100 text-center">
              <div className="card-body p-4">
                <div className={`bg-${value.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                     style={{width: '70px', height: '70px'}}>
                  <i className={`fas ${value.icon} fa-2x text-${value.color}`}></i>
                </div>
                <h6 className="fw-semibold mb-2">{value.title}</h6>
                <p className="text-muted small mb-0">{value.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team */}
      <h4 className="fw-bold mb-3">
        <i className="fas fa-users text-success me-2"></i>Meet Our Team
      </h4>
      <div className="row g-3">
        {team.map((member, index) => (
          <div className="col-12 col-md-6" key={index}>
            <div className="card shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                       style={{width: '60px', height: '60px'}}>
                    <i className={`fas ${member.icon} fa-lg text-white`}></i>
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <h6 className="fw-semibold mb-1 text-dark">{member.name}</h6>
                    <p className="text-primary small fw-medium mb-1">{member.role}</p>
                    <p className="text-muted small mb-2">{member.specialty}</p>
                    <span className="badge bg-info bg-opacity-10 text-info">
                      <i className="fas fa-briefcase me-1"></i>{member.experience}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
