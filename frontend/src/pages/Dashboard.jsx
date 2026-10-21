import {
  Boxes,
  CalendarDays,
  UserRound,
  UsersRound,
} from 'lucide-react'

function Dashboard() {
  return (
    <>
      {/* BIENVENIDA */}
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

      {/* ESTADÍSTICAS */}
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
            <small>18 nuevos este mes</small>
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
            <small>4 citas pendientes</small>
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
            <small>6 realizadas esta semana</small>
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
            <small>Revisa productos con stock bajo</small>
          </div>
        </article>
      </section>

      {/* PANELES INFERIORES */}
      <section className="dashboard-overview-grid">
        {/* AGENDA */}
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

              <div className="dashboard-appointment-line" />

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

              <div className="dashboard-appointment-line" />

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

              <div className="dashboard-appointment-line" />

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

              <div className="dashboard-appointment-line" />

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

        {/* VISTA RÁPIDA */}
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
    </>
  )
}

export default Dashboard