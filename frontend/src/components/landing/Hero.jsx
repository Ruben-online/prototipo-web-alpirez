import clinicLogo from '../../assets/clinica-alpirez-logo.png'

// Año de inicio de experiencia profesional.
// Confirmar con la doctora antes de publicar.
const EXPERIENCE_START_YEAR = 2017

function Hero({ info }) {
  const yearsOfExperience = Math.max(
    0,
    new Date().getFullYear() - EXPERIENCE_START_YEAR
  )

  // Valores dinámicos provenientes del backend con fallback local.
  const heroData = info?.hero || {
    eyebrow: 'DERMATOLOGÍA CLÍNICA Y ESTÉTICA',
    titleMain: 'Cuida tu piel.',
    titleAccent: 'Realza tu belleza.',
    description:
      'Atención dermatológica personalizada con un enfoque profesional, cercano y pensado para el bienestar de tu piel.',
    stats: [
      {
        value: yearsOfExperience,
        label: 'Años de experiencia',
      },
      {
        value: '100%',
        label: 'Atención personalizada',
      },
    ],
  }

  // Mantener el cálculo actualizado aunque el backend
  // todavía devuelva el valor anterior de experiencia.
  const stats = (heroData.stats ?? []).map((stat) => {
    if (stat.label === 'Años de experiencia') {
      return {
        ...stat,
        value: yearsOfExperience,
      }
    }

    return stat
  })

  return (
    <section id="inicio" className="hero">
      <div className="hero-container">

        <div className="hero-content">
          <span className="hero-eyebrow">
            {heroData.eyebrow}
          </span>

          <h1>
            {heroData.titleMain}
            <br />
            <span>{heroData.titleAccent}</span>
          </h1>

          <p>{heroData.description}</p>

          <div className="hero-actions">
            <a href="#contacto" className="hero-button-primary">
              Agendar una cita
              <span>→</span>
            </a>

            <a href="#servicios" className="hero-button-secondary">
              Conocer servicios
            </a>
          </div>

          <div className="hero-trust">
            {stats.map((stat, idx) => (
              <div key={idx} style={{ display: 'contents' }}>
                <div className="hero-trust-item">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>

                {idx < stats.length - 1 && (
                  <div className="hero-trust-divider"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-background"></div>

          <div className="hero-image-container hero-logo-container">
            <img
              src={clinicLogo}
              alt="Dermo Clini-K - Dermatología y Medicina Estética Facial y Corporal"
              className="hero-image hero-clinic-logo"
            />

            <div className="hero-image-caption">
              <div>
                <strong>Dermatología integral</strong>
                <span>Salud, belleza y bienestar</span>
              </div>
            </div>
          </div>

          <div className="hero-floating-card">
            <div>
              <strong>Cuidado especializado</strong>
              <span>Para tu piel</span>
            </div>
          </div>

          <div className="hero-visual-detail">
            <span>ATENCIÓN</span>
            <strong>Personalizada</strong>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero