import TreatmentCategoryCard from './TreatmentCategoryCard'
import { treatmentCategories } from '../../data/treatmentCategories'

function Treatments() {
  const totalTreatments = treatmentCategories.reduce(
    (total, category) => total + category.treatments.length,
    0
  )

  return (
    <section id="tratamientos" className="treatments">
      <div className="treatments-container">

        <div className="treatments-header">
          <span className="section-eyebrow">
            NUESTROS TRATAMIENTOS
          </span>

          <h2>
            Cuidado especializado
            <br />
            <span>para cada necesidad</span>
          </h2>

          <p>
            Descubre nuestras opciones de dermatología y medicina
            estética. Cada tratamiento comienza con una valoración
            personalizada para conocer las necesidades de tu piel.
          </p>
        </div>

        <div className="treatments-summary">
          <span>
            {treatmentCategories.length} categorías
          </span>

          <span
            className="treatments-summary-divider"
            aria-hidden="true"
          />

          <span>
            {totalTreatments} tratamientos
          </span>
        </div>

        <div className="treatments-grid">
          {treatmentCategories.map((category) => (
            <TreatmentCategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>

        <div className="treatments-footer">
          <p>
            ¿No sabes cuál es el tratamiento adecuado para ti?
          </p>

          <a href="#contacto" className="treatments-footer-link">
            Agenda una valoración personalizada
          </a>
        </div>

      </div>
    </section>
  )
}

export default Treatments