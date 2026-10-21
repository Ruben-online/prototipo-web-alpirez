function Treatments() {
  const treatments = [
    {
      number: '01',
      title: 'Acné',
      description:
        'Tratamiento personalizado para controlar el acné y mejorar la salud y apariencia de la piel.',
      image:
        'https://static.wixstatic.com/media/a55bca_0fbb9e0054824178b7780071c1f21daa~mv2.png/v1/fill/w_980,h_980,al_c,q_90/a55bca_0fbb9e0054824178b7780071c1f21daa~mv2.png',
    },
    {
      number: '02',
      title: 'Manchas',
      description:
        'Opciones dermatológicas para tratar diferentes tipos de manchas y recuperar un tono más uniforme.',
      image:
        'https://static.wixstatic.com/media/e462eb_68b0ca67832b4ce5815a4a05511e6d8d~mv2.jpg/v1/fill/w_1000,h_667,al_c,q_85/e462eb_68b0ca67832b4ce5815a4a05511e6d8d~mv2.jpg',
    },
    {
      number: '03',
      title: 'Rejuvenecimiento',
      description:
        'Procedimientos orientados a mejorar la textura, luminosidad y apariencia general de la piel.',
      image:
        'https://static.wixstatic.com/media/722990_d47bcb42b0f94d248a6a7d81dade8493~mv2.png/v1/fill/w_720,h_500,al_c,q_85/722990_d47bcb42b0f94d248a6a7d81dade8493~mv2.png',
    },
    {
      number: '04',
      title: 'Caída del cabello',
      description:
        'Evaluación especializada para identificar las causas y establecer un tratamiento adecuado.',
      image:
        'https://www.myskinmyself.in/assets/images/Trichology%20treatment/2.%20Hair%20fall%20control.png',
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

        <div className="treatments-grid">
          {treatments.map((treatment) => (
            <a
              href="#contacto"
              className="treatment-card"
              key={treatment.number}
            >
              <div className="treatment-image-wrapper">
                <img
                  src={treatment.image}
                  alt={treatment.title}
                  className="treatment-image"
                  loading="lazy"
                />

                <span className="treatment-number">
                  {treatment.number}
                </span>
              </div>

              <div className="treatment-content">
                <div className="treatment-title-row">
                  <h3>{treatment.title}</h3>

                  <span className="treatment-arrow">
                    ↗
                  </span>
                </div>

                <p>{treatment.description}</p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Treatments