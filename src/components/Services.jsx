function Services() {
  const services = [
    {
      number: '01',
      title: 'Dermatología clínica',
      description:
        'Evaluación y tratamiento especializado para cuidar la salud de tu piel, cabello y uñas.',
    },
    {
      number: '02',
      title: 'Dermatología estética',
      description:
        'Procedimientos diseñados para mejorar la apariencia de la piel de forma natural y personalizada.',
    },
    {
      number: '03',
      title: 'Cuidado preventivo',
      description:
        'Valoración profesional y seguimiento para mantener una piel saludable a largo plazo.',
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
            <article className="service-card" key={service.number}>
              <span className="service-number">
                {service.number}
              </span>

              <div className="service-card-content">
                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <a href="#contacto" className="service-link">
                  Conocer más <span>→</span>
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