import heroImage from '../../assets/hero-dermatology.webp'

function Hero({ info }) {
  // Valores dinámicos provenientes del backend con fallback local elegante
  const heroData = info?.hero || {
    eyebrow: 'DERMATOLOGÍA CLÍNICA Y ESTÉTICA',
    titleMain: 'Cuida tu piel.',
    titleAccent: 'Realza tu belleza.',
    description:
      'Atención dermatológica personalizada con un enfoque profesional, cercano y pensado para el bienestar de tu piel.',
    stats: [
      { value: '+10', label: 'Años de experiencia' },
      { value: '100%', label: 'Atención personalizada' }
    ]
  }

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

          <p>
            {heroData.description}
          </p>

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
            {heroData.stats.map((stat, idx) => (
              <div key={idx} style={{ display: 'contents' }}>
                <div className="hero-trust-item">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
                {idx < heroData.stats.length - 1 && (
                  <div className="hero-trust-divider"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-background"></div>

          <div className="hero-image-container">
            <img
              src={heroImage}
              alt="Atención dermatológica"
              className="hero-image"
            />

            <div className="hero-image-gradient"></div>

            <div className="hero-image-caption">
              <span className="hero-caption-icon">✦</span>

              <div>
                <strong>Dermatología integral</strong>
                <span>Salud, belleza y bienestar</span>
              </div>
            </div>
          </div>

          <div className="hero-floating-card">
            <span className="hero-floating-icon">✦</span>

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
