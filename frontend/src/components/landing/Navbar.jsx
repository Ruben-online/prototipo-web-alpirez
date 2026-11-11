import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, UserRound, X } from 'lucide-react'

import butterflyLogo from '../../assets/dermo-clinik-butterfly-transparent.png'
import wordmarkLogo from '../../assets/dermo-clinik-wordmark.png'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen((previousState) => !previousState)
  }

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* LOGOTIPO */}

        <Link
          to="/#inicio"
          className="navbar-logo"
          onClick={closeMenu}
          aria-label="Dermo Clini-K - Inicio"
        >
          <span className="navbar-logo-icon navbar-butterfly-icon">
            <img
              src={butterflyLogo}
              alt=""
              className="navbar-butterfly-image"
            />
          </span>

          <span className="navbar-brand-text">
            <img
              src={wordmarkLogo}
              alt="Dermo Clini-K"
              className="navbar-wordmark-image"
            />

            <small>
              Dermatología · Medicina Estética Facial y Corporal
            </small>
          </span>
        </Link>

        {/* NAVEGACIÓN */}

        <nav
          id="navbar-navigation"
          className={`navbar-links ${
            isMenuOpen ? 'navbar-links-open' : ''
          }`}
          aria-label="Navegación principal"
        >
          <Link to="/#inicio" onClick={closeMenu}>
            Inicio
          </Link>

          <Link to="/#servicios" onClick={closeMenu}>
            Servicios
          </Link>

          <Link to="/#sobre-mi" onClick={closeMenu}>
            Sobre mí
          </Link>

          <Link to="/#tratamientos" onClick={closeMenu}>
            Tratamientos
          </Link>

          <Link to="/#ubicacion-horarios" onClick={closeMenu}>
            Ubicación y horarios
          </Link>

          <Link to="/#contacto" onClick={closeMenu}>
            Contacto
          </Link>
        </nav>

        {/* AGENDAR CITA */}

        <Link
          to="/#contacto"
          className="navbar-appointment"
          onClick={closeMenu}
        >
          <UserRound size={17} />
          <span>Agendar cita</span>
        </Link>

        {/* MENÚ RESPONSIVE */}

        <button
          type="button"
          className="navbar-menu-button"
          aria-label={
            isMenuOpen ? 'Cerrar menú' : 'Abrir menú'
          }
          aria-expanded={isMenuOpen}
          aria-controls="navbar-navigation"
          onClick={toggleMenu}
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