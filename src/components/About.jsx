function About() {
  return (
    <section id="sobre-mi" className="about">
      <div className="about-container">

        <div className="about-visual">
          <div className="about-image-background"></div>

          <div className="about-image-container">
            <img
              src="/src/assets/about-doctor.jpg"
              alt="Atención dermatológica"
              className="about-image"
            />

            <div className="about-image-overlay"></div>

            <div className="about-image-label">
              <span>✦</span>

              <div>
                <strong>Dra. Alpírez</strong>
                <small>Dermatología clínica y estética</small>
              </div>
            </div>
          </div>

          <div className="about-experience">
            <strong>+10</strong>

            <span>
              Años de
              <br />
              experiencia
            </span>
          </div>
        </div>

        <div className="about-content">
          <span className="section-eyebrow">
            CONOCE A LA DOCTORA
          </span>

          <h2>
            Una atención que
            <br />
            <span>comienza contigo.</span>
          </h2>

          <p>
            La Dra. Alpírez es especialista en dermatología,
            comprometida con brindar una atención cercana,
            profesional y personalizada a cada paciente.
          </p>

          <p>
            Su enfoque combina conocimiento médico, tecnología
            y una visión integral de la salud de la piel para
            desarrollar tratamientos adaptados a las necesidades
            de cada persona.
          </p>

          <div className="about-highlights">

            <div className="about-highlight">
              <span className="about-highlight-icon">✦</span>

              <div>
                <strong>Atención personalizada</strong>

                <p>
                  Cada paciente recibe un enfoque individual.
                </p>
              </div>
            </div>

            <div className="about-highlight">
              <span className="about-highlight-icon">✦</span>

              <div>
                <strong>Enfoque profesional</strong>

                <p>
                  Tratamientos basados en valoración especializada.
                </p>
              </div>
            </div>

          </div>

          <a href="#contacto" className="about-button">
            <span>Conocer más sobre la doctora</span>

            <span className="about-button-arrow">
              ↗
            </span>
          </a>
        </div>

      </div>
    </section>
  )
}

export default About