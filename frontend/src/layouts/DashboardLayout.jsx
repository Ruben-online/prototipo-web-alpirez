import { useState } from 'react'
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
            onClick={logout}
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

    </div>
  )
}

export default DashboardLayout