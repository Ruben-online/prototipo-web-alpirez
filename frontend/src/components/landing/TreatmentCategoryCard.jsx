import { useState } from 'react'
import { ChevronDown, ArrowUpRight } from 'lucide-react'

function TreatmentCategoryCard({ category }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const treatments = category.treatments ?? []
  const panelId = `treatment-panel-${category.id}`

  const toggleExpanded = () => {
    setIsExpanded((previous) => !previous)
  }

  return (
    <article
      className={`treatment-card ${isExpanded ? 'is-expanded' : ''}`}
    >
      {category.image && (
        <div className="treatment-card-image">
          <img
            src={category.image}
            alt={category.imageAlt || ''}
            loading="lazy"
            decoding="async"
            style={{
              objectPosition: category.imagePosition || 'center',
            }}
          />

          <span className="treatment-image-number">
            {category.number}
          </span>
        </div>
      )}

      <div className="treatment-card-main">
        <div className="treatment-card-top">
          <span className="treatment-category-label">
            Tratamientos especializados
          </span>

          <span className="treatment-count">
            {treatments.length}{' '}
            {treatments.length === 1 ? 'tratamiento' : 'tratamientos'}
          </span>
        </div>

        <div className="treatment-content">
          <h3>{category.title}</h3>

          <p>{category.description}</p>
        </div>

        <button
          type="button"
          className="treatment-toggle"
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
          aria-controls={panelId}
        >
          <span>
            {isExpanded ? 'Ocultar tratamientos' : 'Ver tratamientos'}
          </span>

          <ChevronDown
            size={20}
            aria-hidden="true"
            className={`treatment-toggle-icon ${
              isExpanded ? 'is-rotated' : ''
            }`}
          />
        </button>
      </div>

      <div
        id={panelId}
        className="treatment-panel"
        hidden={!isExpanded}
      >
        <div className="treatment-panel-inner">
          <h4>Tratamientos disponibles</h4>

          <ul className="treatment-list">
            {treatments.map((treatment) => (
              <li key={treatment.id}>
                <span
                  className="treatment-list-marker"
                  aria-hidden="true"
                />

                <span>{treatment.name}</span>
              </li>
            ))}
          </ul>

          <a
            href="#contacto"
            className="treatment-contact-link"
          >
            Consultar sobre estos tratamientos

            <ArrowUpRight
              size={18}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </article>
  )
}

export default TreatmentCategoryCard