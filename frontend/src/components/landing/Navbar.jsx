import { useState } from 'react'
import { Menu, UserRound, X } from 'lucide-react'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="navbar-container">

        <a href="#" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-icon">✦</span>
          <span>
            DRA. ALPÍREZ
          </span>
        </a>

        <nav className={`navbar-links ${isMenuOpen ? 'navbar-links-open' : ''}`}>
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

        <a href="#contacto" className="navbar-appointment">
          <UserRound size={17} />
          <span>Agendar cita</span>
        </a>

        <button
          className="navbar-menu-button"
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

      </div>
    </header>
  )
}

export default Navbar