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
  UserRound,
  UsersRound,
} from 'lucide-react'

const navigation = [
  {
    label: 'Resumen',
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: 'Pacientes',
    icon: UsersRound,
  },
  {
    label: 'Citas',
    icon: CalendarDays,
  },
  {
    label: 'Inventario',
    icon: Boxes,
  },
  {
    label: 'Reportes',
    icon: ClipboardList,
  },
]

function Dashboard() {
  return (
    <div className="dashboard-page">

      <aside className="dashboard-sidebar">

        <div className="dashboard-sidebar-header">
          <div className="dashboard-logo">
            DA
          </div>

          <div className="dashboard-brand">
            <strong>Dra. Alpírez</strong>
            <span>Panel administrativo</span>
          </div>
        </div>

        <nav className="dashboard-navigation">
          <span className="dashboard-navigation-label">
            MENÚ PRINCIPAL
          </span>

          <div className="dashboard-navigation-list">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.label}
                  type="button"
                  className={`dashboard-nav-item ${
                    item.active ? 'active' : ''
                  }`}
                >
                  <Icon size={19} strokeWidth={1.8} />

                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <button
            type="button"
            className="dashboard-nav-item"
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>Configuración</span>
          </button>

          <button
            type="button"
            className="dashboard-logout"
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
            >
              <Menu size={21} />
            </button>

            <div>
              <span className="dashboard-header-eyebrow">
                PANEL ADMINISTRATIVO
              </span>

              <h1>Resumen</h1>
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

              <span className="dashboard-notification-dot"></span>
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

              <ChevronDown
                size={16}
                strokeWidth={1.8}
              />
            </button>

          </div>

        </header>

        <div className="dashboard-content">

          <section className="dashboard-welcome">

            <div>
              <span className="dashboard-section-eyebrow">
                DOMINGO, 4 DE OCTUBRE
              </span>

              <h2>
                Buenas tardes, Dra. Alpírez.
              </h2>

              <p>
                Aquí tienes un resumen de la actividad de la clínica.
              </p>
            </div>

            <button
              type="button"
              className="dashboard-primary-button"
            >
              <CalendarDays size={18} strokeWidth={1.8} />

              <span>Nueva cita</span>
            </button>

          </section>

          <section className="dashboard-stats">

            <article className="dashboard-stat-card">

              <div className="dashboard-stat-top">
                <div className="dashboard-stat-icon">
                  <UsersRound size={21} strokeWidth={1.8} />
                </div>

                <span className="dashboard-stat-change positive">
                  +8.2%
                </span>
              </div>

              <div className="dashboard-stat-content">
                <span>Pacientes registrados</span>

                <strong>248</strong>

                <small>
                  18 nuevos este mes
                </small>
              </div>

            </article>

            <article className="dashboard-stat-card">

              <div className="dashboard-stat-top">
                <div className="dashboard-stat-icon">
                  <CalendarDays size={21} strokeWidth={1.8} />
                </div>

                <span className="dashboard-stat-badge">
                  Hoy
                </span>
              </div>

              <div className="dashboard-stat-content">
                <span>Citas programadas</span>

                <strong>12</strong>

                <small>
                  4 citas pendientes
                </small>
              </div>

            </article>

            <article className="dashboard-stat-card">

              <div className="dashboard-stat-top">
                <div className="dashboard-stat-icon">
                  <UserRound size={21} strokeWidth={1.8} />
                </div>

                <span className="dashboard-stat-change positive">
                  +5.4%
                </span>
              </div>

              <div className="dashboard-stat-content">
                <span>Consultas del mes</span>

                <strong>86</strong>

                <small>
                  6 realizadas esta semana
                </small>
              </div>

            </article>

            <article className="dashboard-stat-card">

              <div className="dashboard-stat-top">
                <div className="dashboard-stat-icon">
                  <Boxes size={21} strokeWidth={1.8} />
                </div>

                <span className="dashboard-stat-warning">
                  3 alertas
                </span>
              </div>

              <div className="dashboard-stat-content">
                <span>Productos en inventario</span>

                <strong>64</strong>

                <small>
                  Revisa productos con stock bajo
                </small>
              </div>

            </article>

          </section>

          <section className="dashboard-overview-grid">

            <article className="dashboard-panel dashboard-schedule">

              <div className="dashboard-panel-header">
                <div>
                  <span className="dashboard-panel-eyebrow">
                    AGENDA
                  </span>

                  <h3>Citas de hoy</h3>
                </div>

                <button type="button">
                  Ver todas
                </button>
              </div>

              <div className="dashboard-appointments">

                <div className="dashboard-appointment">
                  <div className="dashboard-appointment-time">
                    <strong>09:00</strong>
                    <span>AM</span>
                  </div>

                  <div className="dashboard-appointment-line"></div>

                  <div className="dashboard-appointment-info">
                    <strong>María González</strong>
                    <span>Consulta dermatológica</span>
                  </div>

                  <span className="dashboard-status confirmed">
                    Confirmada
                  </span>
                </div>

                <div className="dashboard-appointment">
                  <div className="dashboard-appointment-time">
                    <strong>10:30</strong>
                    <span>AM</span>
                  </div>

                  <div className="dashboard-appointment-line"></div>

                  <div className="dashboard-appointment-info">
                    <strong>Andrea Martínez</strong>
                    <span>Control de tratamiento</span>
                  </div>

                  <span className="dashboard-status pending">
                    Pendiente
                  </span>
                </div>

                <div className="dashboard-appointment">
                  <div className="dashboard-appointment-time">
                    <strong>12:00</strong>
                    <span>PM</span>
                  </div>

                  <div className="dashboard-appointment-line"></div>

                  <div className="dashboard-appointment-info">
                    <strong>Carolina Ramírez</strong>
                    <span>Dermatología estética</span>
                  </div>

                  <span className="dashboard-status confirmed">
                    Confirmada
                  </span>
                </div>

                <div className="dashboard-appointment">
                  <div className="dashboard-appointment-time">
                    <strong>02:30</strong>
                    <span>PM</span>
                  </div>

                  <div className="dashboard-appointment-line"></div>

                  <div className="dashboard-appointment-info">
                    <strong>Laura Castillo</strong>
                    <span>Primera consulta</span>
                  </div>

                  <span className="dashboard-status pending">
                    Pendiente
                  </span>
                </div>

              </div>

            </article>

            <article className="dashboard-panel dashboard-quick-panel">

              <div className="dashboard-panel-header">
                <div>
                  <span className="dashboard-panel-eyebrow">
                    ACTIVIDAD
                  </span>

                  <h3>Vista rápida</h3>
                </div>
              </div>

              <div className="dashboard-quick-list">

                <div className="dashboard-quick-item">
                  <div className="dashboard-quick-icon">
                    <UsersRound size={19} strokeWidth={1.8} />
                  </div>

                  <div>
                    <strong>3 pacientes nuevos</strong>
                    <span>Registrados esta semana</span>
                  </div>
                </div>

                <div className="dashboard-quick-item">
                  <div className="dashboard-quick-icon">
                    <CalendarDays size={19} strokeWidth={1.8} />
                  </div>

                  <div>
                    <strong>4 citas pendientes</strong>
                    <span>Requieren confirmación</span>
                  </div>
                </div>

                <div className="dashboard-quick-item">
                  <div className="dashboard-quick-icon">
                    <Boxes size={19} strokeWidth={1.8} />
                  </div>

                  <div>
                    <strong>3 productos con stock bajo</strong>
                    <span>Revisar inventario</span>
                  </div>
                </div>

              </div>

              <div className="dashboard-quick-decoration">
                <span>✦</span>

                <div>
                  <strong>Todo bajo control</strong>
                  <p>
                    Mantén organizada la actividad diaria de la clínica.
                  </p>
                </div>
              </div>

            </article>

          </section>

        </div>

      </main>

    </div>
  )
}

export default Dashboard