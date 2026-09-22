import { Menu, UserRound } from 'lucide-react'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <a href="#" className="navbar-logo">
          <span className="navbar-logo-icon">✦</span>
          <span>
            Dra. Marcela Alpírez
          </span>
        </a>

        <nav className="navbar-links">
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#tratamientos">Tratamientos</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <a href="#" className="navbar-appointment">
          <UserRound size={17} />
          <span>Iniciar sesión</span>
        </a>

        <button className="navbar-menu-button" aria-label="Abrir menú">
          <Menu size={25} />
        </button>

      </div>
    </header>
  )
}

export default Navbar