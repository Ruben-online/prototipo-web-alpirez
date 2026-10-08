import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import {
  Bell,
  Boxes,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  UsersRound,
  X,
} from 'lucide-react'

const navigation = [
  {
    label: 'Resumen',
    icon: LayoutDashboard,
    path: '/dashboard',
    end: true,
  },
  {
    label: 'Pacientes',
    icon: UsersRound,
    path: '/dashboard/pacientes',
  },
  {
    label: 'Citas',
    icon: CalendarDays,
    path: '/dashboard/citas',
  },
  {
    label: 'Inventario',
    icon: Boxes,
    path: '/dashboard/inventario',
  },
  {
    label: 'Reportes',
    icon: ClipboardList,
    path: '/dashboard/reportes',
  },
]

function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const currentSection =
    [...navigation, {
      label: 'Configuración',
      path: '/dashboard/configuracion',
    }]
      .find((item) =>
        item.end
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path)
      )?.label || 'Resumen'

  const closeMenu = () => setMenuOpen(false)

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

          <div className="dashboard-logo">
            DA
          </div>

          <div className="dashboard-brand">
            <strong>Dra. Alpírez</strong>
            <span>Panel administrativo</span>
          </div>

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

            {navigation.map((item) => {
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

          <NavLink
            to="/dashboard/configuracion"
            onClick={closeMenu}
            className={({ isActive }) =>
              `dashboard-nav-item ${
                isActive ? 'active' : ''
              }`
            }
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>Configuración</span>
          </NavLink>

          <NavLink
            to="/login"
            className="dashboard-logout"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>Cerrar sesión</span>
          </NavLink>

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

            <button
              type="button"
              className="dashboard-notification"
              aria-label="Notificaciones"
            >
              <Bell size={20} strokeWidth={1.8} />
              <span className="dashboard-notification-dot" />
            </button>

            <button
              type="button"
              className="dashboard-profile"
            >
              <div className="dashboard-avatar">
                DA
              </div>

              <div className="dashboard-profile-info">
                <strong>Dra. Alpírez</strong>
                <span>Administradora</span>
              </div>

              <ChevronDown size={16} strokeWidth={1.8} />
            </button>

          </div>

        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>

      </main>

    </div>
  )
}

export default DashboardLayout