export default function Services() {
  const services = [
    { icon: 'fa-heart-pulse', title: 'Cardiology', description: 'Comprehensive heart care including ECG, echocardiography, and cardiac rehabilitation.', features: ['Heart Health Screening', 'ECG & Monitoring', 'Cardiac Rehabilitation'], color: 'danger' },
    { icon: 'fa-brain', title: 'Neurology', description: 'Expert diagnosis and treatment of brain, spine, and nervous system disorders.', features: ['Brain Imaging', 'Nerve Studies', 'Migraine Treatment'], color: 'primary' },
    { icon: 'fa-bone', title: 'Orthopedics', description: 'Specialized care for bones, joints, muscles, and sports-related injuries.', features: ['Joint Replacement', 'Sports Medicine', 'Physical Therapy'], color: 'warning' },
    { icon: 'fa-baby', title: 'Pediatrics', description: 'Dedicated healthcare for infants, children, and adolescents.', features: ['Well-Child Visits', 'Vaccinations', 'Growth Monitoring'], color: 'success' },
    { icon: 'fa-flask', title: 'Laboratory', description: 'State-of-the-art diagnostic testing with quick and accurate results.', features: ['Blood Tests', 'Pathology', 'Genetic Testing'], color: 'info' },
    { icon: 'fa-x-ray', title: 'Radiology', description: 'Advanced imaging services for accurate diagnosis and treatment planning.', features: ['X-Ray', 'CT Scan', 'MRI Imaging'], color: 'secondary' }
  ]

  return (
    <div className="page">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h2 fw-bold text-dark mb-1">Our Services</h1>
          <p className="text-muted mb-0">Comprehensive healthcare services tailored to your needs</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="row g-3 g-lg-4 mb-4">
        {services.map((service, index) => (
          <div className="col-12 col-sm-6 col-lg-4" key={index}>
            <div className="card shadow-sm h-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className={`bg-${service.color} bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3`}
                     style={{width: '60px', height: '60px'}}>
                  <i className={`fas ${service.icon} fa-lg text-${service.color}`}></i>
                </div>
                <h5 className="fw-semibold mb-2">{service.title}</h5>
                <p className="text-muted small mb-3 flex-grow-1">{service.description}</p>
                <ul className="list-unstyled mb-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="small text-muted mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>{feature}
                    </li>
                  ))}
                </ul>
                <button className="btn btn-outline-primary btn-sm w-100 mt-auto">
                  <i className="fas fa-arrow-right me-1"></i>Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="card bg-primary bg-gradient text-white shadow">
        <div className="card-body text-center py-5">
          <i className="fas fa-headset fa-3x mb-3 opacity-75"></i>
          <h3 className="fw-bold mb-2">Need Help Choosing a Service?</h3>
          <p className="mb-4 opacity-90">Our patient coordinators are available to help you find the right care.</p>
          <button className="btn btn-light btn-lg px-4">
            <i className="fas fa-phone-alt me-2"></i>Contact Us Today
          </button>
        </div>
      </div>
    </div>
  )
}
