function Services() {
  const services = [
    {
      number: '01',
      title: 'Dermatología clínica',
      description:
        'Evaluación y tratamiento especializado para cuidar la salud de tu piel, cabello y uñas.',
      image:
        'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1000&q=85',
    },
    {
      number: '02',
      title: 'Dermatología estética',
      description:
        'Procedimientos diseñados para mejorar la apariencia de la piel de forma natural y personalizada.',
      image:
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=85',
    },
    {
      number: '03',
      title: 'Cuidado preventivo',
      description:
        'Valoración profesional y seguimiento para mantener una piel saludable a largo plazo.',
      image:
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=85',
    },
  ]

  return (
    <section id="servicios" className="services">
      <div className="services-container">

        <div className="services-header">
          <div>
            <span className="section-eyebrow">
              NUESTROS SERVICIOS
            </span>

            <h2>
              Cuidado especializado
              <br />
              <span>para tu piel</span>
            </h2>
          </div>

          <p>
            Cada piel es diferente. Por eso ofrecemos una atención
            personalizada que combina experiencia, tecnología y
            un enfoque centrado en cada paciente.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article
              className="service-card"
              key={service.number}
            >
              <div className="service-image-wrapper">
                <img
                  src={service.image}
                  alt={service.title}
                  className="service-image"
                  loading="lazy"
                />

                <div className="service-image-overlay"></div>

                <span className="service-number">
                  {service.number}
                </span>
              </div>

              <div className="service-card-content">
                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <a href="#contacto" className="service-link">
                  <span>Conocer más</span>

                  <span className="service-link-arrow">
                    ↗
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Services