function Footer() {
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
            <a href="#">Iniciar sesión</a>
          </div>
        </div>

        <div className="footer-social">
          <span className="footer-heading">
            Síguenos
          </span>

          <div className="footer-social-links">
            <a href="#" aria-label="Instagram">
              Instagram
            </a>

            <a href="#" aria-label="Facebook">
              Facebook
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <span>
          © 2026 Clínica Dermatológica Dra. Alpírez
        </span>

        <span>
          Todos los derechos reservados.
        </span>
      </div>
    </footer>
  )
}

export default Footer