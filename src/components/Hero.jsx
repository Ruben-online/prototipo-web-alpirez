import heroImage from '../assets/hero-dermatology.webp'

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-container">

        <div className="hero-content">
          <span className="hero-eyebrow">
            DERMATOLOGÍA CLÍNICA Y ESTÉTICA
          </span>

          <h1>
            Cuida tu piel.
            <br />
            <span>Realza tu belleza.</span>
          </h1>

          <p>
            Atención dermatológica personalizada con un enfoque
            profesional, cercano y pensado para el bienestar de tu piel.
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
            <div className="hero-trust-item">
              <strong>+10</strong>
              <span>Años de experiencia</span>
            </div>

            <div className="hero-trust-divider"></div>

            <div className="hero-trust-item">
              <strong>100%</strong>
              <span>Atención personalizada</span>
            </div>
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