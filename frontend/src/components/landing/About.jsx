import aboutImage from '../../assets/doctora-marcela.png'

const EXPERIENCE_START_YEAR = 2017

function About({ info }) {
  const experienceYears =
    new Date().getFullYear() - EXPERIENCE_START_YEAR

  const doctor = {
    title: 'Dra. Alpírez',
    specialty: 'Dermatología clínica y estética',
    bioP1:
      'La Dra. Alpírez es especialista en dermatología, comprometida con brindar una atención cercana, profesional y personalizada a cada paciente.',
    bioP2:
      'Su enfoque combina conocimiento médico, tecnología y una visión integral de la salud de la piel para desarrollar tratamientos adaptados a las necesidades de cada persona.',
    highlights: [
      {
        title: 'Atención personalizada',
        description: 'Cada paciente recibe un enfoque individual.'
      },
      {
        title: 'Enfoque profesional',
        description: 'Tratamientos basados en valoración especializada.'
      }
    ],
    ...info?.doctor,
    experienceYears
  }

  return (
    <section id="sobre-mi" className="about">
      <div className="about-container">

        <div className="about-visual">
          <div className="about-image-background"></div>

          <div className="about-image-container">
            <img
              src={aboutImage}
              alt="Fotografía de la Dra. Marcela Alpírez, especialista en dermatología"
              className="about-image"
            />

            <div className="about-image-overlay"></div>

            <div className="about-image-label">
              <div>
                <strong>{doctor.title}</strong>
                <small>{doctor.specialty}</small>
              </div>
            </div>
          </div>

          <div className="about-experience">
            <strong>{doctor.experienceYears}</strong>

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
            {doctor.bioP1}
          </p>

          <p>
            {doctor.bioP2}
          </p>

          <div className="about-highlights">
            {doctor.highlights.map((highlight, index) => (
              <div
                key={index}
                className="about-highlight"
              >
                <div className="about-highlight-content">
                  <strong>{highlight.title}</strong>

                  <p>{highlight.description}</p>
                </div>
              </div>
            ))}
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