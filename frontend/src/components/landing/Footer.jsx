function Footer({ info }) {
  const brandName = info?.name || 'Clínica Dermatológica Dra. Marcela Alpírez'
  const social = info?.social || {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com'
  }

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <a href="#inicio" className="footer-logo">
            <span className="footer-logo-icon">✦</span>
            <span>DRA. ALPÍREZ</span>
          </a>

          <p>
            Dermatología clínica y estética
            <br />
            con un enfoque personalizado.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <span className="footer-heading">
              Navegación
            </span>

            <a href="#inicio">Inicio</a>
            <a href="#servicios">Servicios</a>
            <a href="#sobre-mi">Sobre mí</a>
          </div>

          <div>
            <span className="footer-heading">
              Información
            </span>

            <a href="#tratamientos">Tratamientos</a>
            <a href="#contacto">Contacto</a>
            <a href="/login">Iniciar sesión</a>
          </div>
        </div>

        <div className="footer-social">
          <span className="footer-heading">
            Síguenos
          </span>

          <div className="footer-social-links">
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              Instagram
            </a>

            <a
              href={social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              Facebook
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {brandName}
        </span>

        <span>
          Todos los derechos reservados.
        </span>
      </div>
    </footer>
  )
}

export default Footer
