import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import {
  Boxes,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UserCog,
  UsersRound,
  X,
} from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import clinicLogo from '../assets/clinica-alpirez-logo.png'

const navigation = [
  {
    label: 'Resumen',
    icon: LayoutDashboard,
    path: '/dashboard',
    module: 'resumen',
    end: true,
  },
  {
    label: 'Pacientes',
    icon: UsersRound,
    path: '/dashboard/pacientes',
    module: 'pacientes',
  },
  {
    label: 'Citas',
    icon: CalendarDays,
    path: '/dashboard/citas',
    module: 'citas',
  },
  {
    label: 'Inventario',
    icon: Boxes,
    path: '/dashboard/inventario',
    module: 'inventario',
  },
  {
    label: 'Reportes',
    icon: ClipboardList,
    path: '/dashboard/reportes',
    module: 'reportes',
  },
  {
    label: 'Usuarios',
    icon: UserCog,
    path: '/dashboard/usuarios',
    module: 'usuarios',
  },
]

function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const location = useLocation()
  const { logout, hasModule } = useAuth()

  // Cada usuario solo ve los módulos que tiene permitidos.
  const visibleNavigation = navigation.filter((item) =>
    hasModule(item.module)
  )

  const currentSection =
    navigation.find((item) =>
      item.end
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path)
    )?.label || 'Resumen'

  const closeMenu = () => setMenuOpen(false)

  const openLogoutModal = () => {
    setMenuOpen(false)
    setLogoutError('')
    setLogoutModalOpen(true)
  }

  const closeLogoutModal = () => {
    if (loggingOut) return

    setLogoutModalOpen(false)
    setLogoutError('')
  }

  const confirmLogout = async () => {
    if (loggingOut) return

    setLoggingOut(true)
    setLogoutError('')

    try {
      await logout()
      setLogoutModalOpen(false)
    } catch {
      setLogoutError(
        'No fue posible cerrar la sesión. Inténtalo nuevamente.'
      )
    } finally {
      setLoggingOut(false)
    }
  }

  // Permite cerrar la confirmación con Escape.
  useEffect(() => {
    if (!logoutModalOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !loggingOut) {
        closeLogoutModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [logoutModalOpen, loggingOut])

  // Evita el desplazamiento de la página mientras el modal está abierto.
  useEffect(() => {
    if (!logoutModalOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [logoutModalOpen])

  return (
    <div className="dashboard-page">

      {menuOpen && (
        <button
          type="button"
          className="dashboard-sidebar-overlay"
          aria-label="Cerrar menú"
          onClick={closeMenu}
        />
      )}

      <aside
        className={`dashboard-sidebar ${
          menuOpen ? 'dashboard-sidebar-open' : ''
        }`}
      >
        <div className="dashboard-sidebar-header">

          <img
            src={clinicLogo}
            alt="Dermo Clini-K - Dermatología y Medicina Estética"
            className="dashboard-clinic-logo"
          />

          <button
            type="button"
            className="dashboard-sidebar-close"
            aria-label="Cerrar menú"
            onClick={closeMenu}
          >
            <X size={20} />
          </button>

        </div>

        <nav className="dashboard-navigation">

          <span className="dashboard-navigation-label">
            MENÚ PRINCIPAL
          </span>

          <div className="dashboard-navigation-list">

            {visibleNavigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `dashboard-nav-item ${
                      isActive ? 'active' : ''
                    }`
                  }
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}

          </div>

        </nav>

        <div className="dashboard-sidebar-bottom">

          <button
            type="button"
            className="dashboard-logout"
            onClick={openLogoutModal}
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>Cerrar sesión</span>
          </button>

        </div>

      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div className="dashboard-header-left">

            <button
              type="button"
              className="dashboard-mobile-menu"
              aria-label="Abrir menú"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={21} />
            </button>

            <div>
              <span className="dashboard-header-eyebrow">
                PANEL ADMINISTRATIVO
              </span>

              <h1>{currentSection}</h1>
            </div>

          </div>

          <div className="dashboard-header-actions">

            <div className="dashboard-search">
              <Search size={18} strokeWidth={1.8} />

              <input
                type="text"
                placeholder="Buscar paciente..."
              />
            </div>

          </div>

        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>

      </main>

      {/* Modal de confirmación de cierre de sesión */}
      {logoutModalOpen && (
        <div
          className="dashboard-logout-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLogoutModal()
            }
          }}
        >
          <div
            className="dashboard-logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-logout-modal-title"
            aria-describedby="dashboard-logout-modal-description"
          >
            <div className="dashboard-logout-modal-icon">
              <LogOut size={26} strokeWidth={1.8} />
            </div>

            <h2 id="dashboard-logout-modal-title">
              ¿Cerrar sesión?
            </h2>

            <p id="dashboard-logout-modal-description">
              Estás a punto de cerrar tu sesión.
              ¿Estás seguro de que deseas continuar?
            </p>

            {logoutError && (
              <div
                className="dashboard-logout-modal-error"
                role="alert"
              >
                {logoutError}
              </div>
            )}

            <div className="dashboard-logout-modal-actions">

              <button
                type="button"
                className="dashboard-logout-modal-cancel"
                onClick={closeLogoutModal}
                disabled={loggingOut}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="dashboard-logout-modal-confirm"
                onClick={confirmLogout}
                disabled={loggingOut}
              >
                <LogOut size={17} strokeWidth={1.8} />

                <span>
                  {loggingOut
                    ? 'Cerrando sesión...'
                    : 'Sí, cerrar sesión'}
                </span>
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DashboardLayout