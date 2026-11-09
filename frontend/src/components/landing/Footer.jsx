import wordmarkLogo from '../../assets/dermo-clinik-wordmark.png'
import butterflyLogo from '../../assets/dermo-clinik-butterfly-transparent.png'

function Footer({ info }) {
  const brandName =
    info?.name || 'Clínica Dermatológica Dra. Marcela Alpírez'

  const social = info?.social || {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com'
  }

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* IDENTIDAD DE LA CLÍNICA */}
        <div className="footer-brand">
          <a
            href="#inicio"
            className="footer-logo"
            aria-label="Dermo Clini-K - Volver al inicio"
          >
            <img
              src={butterflyLogo}
              alt=""
              className="footer-butterfly-image"
            />

            <img
              src={wordmarkLogo}
              alt="Dermo Clini-K"
              className="footer-wordmark-image"
            />
          </a>

          <p>
            Dermatología · Medicina Estética
            <br />
            Facial y Corporal
          </p>
        </div>

        {/* NAVEGACIÓN */}
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

        {/* REDES SOCIALES */}
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

      {/* DERECHOS DE AUTOR */}
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