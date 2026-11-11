import { useState } from 'react'
import { servicesCatalog } from '../../data/servicesData'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1000&q=85'

function Services({ servicesData }) {
  const [expandedService, setExpandedService] = useState(null)

  const backendServices = Array.isArray(servicesData)
    ? servicesData
    : []

  const services = servicesCatalog.map((service) => {
    const backendService = backendServices.find(
      (item) =>
        String(item.id) === service.id ||
        String(item.number) === service.number
    )

    return {
      ...backendService,
      ...service,
    }
  })

  const toggleService = (id) => {
    setExpandedService((current) =>
      current === id ? null : id
    )
  }

  return (
    <section
      id="servicios"
      className="services"
      aria-labelledby="services-title"
    >
      <div className="services-container">
        <div className="services-header">
          <div>
            <span className="section-eyebrow">
              NUESTROS SERVICIOS
            </span>

            <h2 id="services-title">
              Dermatología Geriátrica
              <br />
              <span>y Medicina Estética</span>
            </h2>
          </div>

          <p>
            Atención dermatológica especializada en adultos,
            con procedimientos médicos y estéticos orientados
            al cuidado, la salud y el bienestar de la piel.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => {
            const isExpanded = expandedService === service.id
            const detailsId = `service-details-${service.id}`

            return (
              <article
                className={`service-card ${
                  isExpanded ? 'service-card-expanded' : ''
                }`}
                key={service.id}
              >
                <div className="service-image-wrapper">
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    className="service-image"
                    loading="lazy"
                    onError={(event) => {
                      if (event.currentTarget.src !== FALLBACK_IMAGE) {
                        event.currentTarget.src = FALLBACK_IMAGE
                      }
                    }}
                  />

                  <div
                    className="service-image-overlay"
                    aria-hidden="true"
                  />

                  <span className="service-number">
                    {service.number}
                  </span>
                </div>

                <div className="service-card-content">
                  <h3>{service.title}</h3>

                  <p className="service-description">
                    {service.description}
                  </p>

                  <button
                    type="button"
                    className="service-link"
                    aria-expanded={isExpanded}
                    aria-controls={detailsId}
                    onClick={() => toggleService(service.id)}
                  >
                    <span>
                      {isExpanded
                        ? 'Ocultar tratamientos'
                        : 'Ver tratamientos'}
                    </span>

                    <span
                      className={`service-link-arrow ${
                        isExpanded ? 'is-expanded' : ''
                      }`}
                      aria-hidden="true"
                    >
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div
                      className="service-details"
                      id={detailsId}
                    >
                      {service.categories.map((category) => (
                        <div
                          className="service-category"
                          key={category.title}
                        >
                          <h4>{category.title}</h4>

                          <ul>
                            {category.treatments.map((treatment) => (
                              <li key={treatment}>
                                {treatment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      <a
                        href="#contacto"
                        className="service-contact-link"
                      >
                        Solicitar información
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Services