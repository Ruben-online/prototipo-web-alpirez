function Treatments() {
  const treatments = [
    {
      number: '01',
      title: 'Acné',
      description:
        'Tratamiento personalizado para controlar el acné y mejorar la salud y apariencia de la piel.',
    },
    {
      number: '02',
      title: 'Manchas',
      description:
        'Opciones dermatológicas para tratar diferentes tipos de manchas y recuperar un tono más uniforme.',
    },
    {
      number: '03',
      title: 'Rejuvenecimiento',
      description:
        'Procedimientos orientados a mejorar la textura, luminosidad y apariencia general de la piel.',
    },
    {
      number: '04',
      title: 'Caída del cabello',
      description:
        'Evaluación especializada para identificar las causas y establecer un tratamiento adecuado.',
    },
  ]

  return (
    <section id="tratamientos" className="treatments">
      <div className="treatments-container">

        <div className="treatments-header">
          <span className="section-eyebrow">
            TRATAMIENTOS
          </span>

          <h2>
            Soluciones pensadas
            <br />
            <span>para tu piel</span>
          </h2>

          <p>
            Conoce algunas de las condiciones y necesidades que
            podemos abordar mediante una valoración dermatológica
            personalizada.
          </p>
        </div>

        <div className="treatments-list">
          {treatments.map((treatment) => (
            <a
              href="#contacto"
              className="treatment-item"
              key={treatment.number}
            >
              <span className="treatment-number">
                {treatment.number}
              </span>

              <div className="treatment-content">
                <h3>{treatment.title}</h3>
                <p>{treatment.description}</p>
              </div>

              <span className="treatment-arrow">
                ↗
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Treatments