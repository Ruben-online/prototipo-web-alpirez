import { useState } from 'react'
import { Menu, UserRound, X } from 'lucide-react'

import butterflyLogo from '../../assets/dermo-clinik-butterfly-transparent.png'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="navbar-container">

        <a
          href="#inicio"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="navbar-logo-icon navbar-butterfly-icon">
            <img
              src={butterflyLogo}
              alt=""
              className="navbar-butterfly-image"
            />
          </span>

          <span className="navbar-brand-text">
            <strong>Dermo Clini-K</strong>

            <small>
              Dermatología · Medicina Estética Facial y Corporal
            </small>
          </span>
        </a>

        <nav
          className={`navbar-links ${
            isMenuOpen ? 'navbar-links-open' : ''
          }`}
        >
          <a href="#inicio" onClick={closeMenu}>
            Inicio
          </a>

          <a href="#servicios" onClick={closeMenu}>
            Servicios
          </a>

          <a href="#sobre-mi" onClick={closeMenu}>
            Sobre mí
          </a>

          <a href="#tratamientos" onClick={closeMenu}>
            Tratamientos
          </a>

          <a href="#contacto" onClick={closeMenu}>
            Contacto
          </a>
        </nav>

        <a
          href="#contacto"
          className="navbar-appointment"
        >
          <UserRound size={17} />
          <span>Agendar cita</span>
        </a>

        <button
          type="button"
          className="navbar-menu-button"
          aria-label={
            isMenuOpen ? 'Cerrar menú' : 'Abrir menú'
          }
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>

      </div>
    </header>
  )
}

export default Navbar