import { Link } from 'react-router-dom'

import wordmarkLogo from '../../assets/dermo-clinik-wordmark.png'
import butterflyLogo from '../../assets/dermo-clinik-butterfly-transparent.png'

import { contactInfoData } from '../../data/contactInfo'

const quetzaltenangoPhone = contactInfoData.phones.find(
  (phone) => phone.id === 'quetzaltenango'
)

const socialLinks = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/dermoclinik/',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/share/1JwxVpkhFC/',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com/@dermoclinikmarcela',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: `https://wa.me/502${quetzaltenangoPhone.number}`,
  },
]

function SocialIcon({ name }) {
  switch (name) {
    case 'instagram':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.5"
            cy="6.5"
            r="1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      )

    case 'facebook':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
        </svg>
      )

    case 'tiktok':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.7 2h-3.2v13.1a3.1 3.1 0 1 1-2.7-3.07V8.8a6.3 6.3 0 1 0 5.9 6.3V8.5a8.2 8.2 0 0 0 4.8 1.5V6.8A5 5 0 0 1 16.7 2Z" />
        </svg>
      )

    case 'whatsapp':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.5 3.5A11.8 11.8 0 0 0 2.1 17.7L.5 23.5l5.9-1.5A11.8 11.8 0 0 0 20.5 3.5ZM12 21a9.2 9.2 0 0 1-4.7-1.3l-.3-.2-3.5.9.9-3.4-.2-.4A9.2 9.2 0 1 1 12 21Zm5.1-6.9c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8s1.2 3.1 1.4 3.3c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.6.8.2 1.5.2 2.1.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.2-.3-.3-.6-.5Z" />
        </svg>
      )

    default:
      return null
  }
}

function Footer({ info }) {
  const brandName =
    info?.name || 'Clínica Dermatológica Dra. Marcela Alpírez'

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* IDENTIDAD DE LA CLÍNICA */}
        <div className="footer-brand">
          <Link
            to="/#inicio"
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
          </Link>

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

            <Link to="/#inicio">Inicio</Link>
            <Link to="/#servicios">Servicios</Link>
            <Link to="/#sobre-mi">Sobre mí</Link>
          </div>

          <div>
            <span className="footer-heading">
              Información
            </span>

            <Link to="/#tratamientos">Tratamientos</Link>
            <Link to="/#contacto">Contacto</Link>
            <Link to="/login">Iniciar sesión</Link>
          </div>
        </div>

        {/* REDES SOCIALES */}
        <div className="footer-social">
          <span className="footer-heading">
            Síguenos y contáctanos
          </span>

          <div className="footer-social-links">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={
                  social.id === 'whatsapp'
                    ? 'Contactar por WhatsApp a Dermo Clini-K Quetzaltenango'
                    : `Visitar ${social.name} de Dermo Clini-K`
                }
              >
                <span className="footer-social-icon">
                  <SocialIcon name={social.id} />
                </span>

                <span className="footer-social-name">
                  {social.name}
                </span>
              </a>
            ))}
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