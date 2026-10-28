import {
  CalendarDays,
  ClipboardList,
  CalendarX,
  Clock3,
  UserRound,
} from 'lucide-react'

// ==========================================
// ESTADOS DE LAS CITAS
// ==========================================

const statusClasses = {
  Confirmada: 'confirmed',
  Completada: 'completed',
  Cancelada: 'cancelled',
  'No asistió': 'missed',
}

// ==========================================
// FORMATO DE FECHA
// ==========================================

function formatAppointmentDate(dateString) {
  if (!dateString) return 'Sin fecha'

  const [year, month, day] = dateString
    .split('-')
    .map(Number)

  const date = new Date(year, month - 1, day)

  if (Number.isNaN(date.getTime())) {
    return 'Fecha no válida'
  }

  return new Intl.DateTimeFormat('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

// ==========================================
// ESTADO DE CITA
// ==========================================

function AppointmentStatus({ status }) {
  return (
    <span
      className={`appointment-report-status ${
        statusClasses[status] || 'confirmed'
      }`}
    >
      <span
        className="appointment-report-status-dot"
        aria-hidden="true"
      />

      {status || 'Sin estado'}
    </span>
  )
}

// ==========================================
// ESTADO VACÍO
// ==========================================

function AppointmentReportsEmpty() {
  return (
    <div className="appointment-reports-empty">

      <div className="appointment-reports-empty-icon">
        <CalendarX size={32} strokeWidth={1.7} />
      </div>

      <h4>No se encontraron citas</h4>

      <p>
        No hay citas que coincidan con los criterios
        seleccionados. Prueba modificando los filtros.
      </p>

    </div>
  )
}

// ==========================================
// TABLA DE ESCRITORIO
// ==========================================

function AppointmentReportsTable({ appointments }) {
  return (
    <div className="appointment-reports-table-wrapper">

      <table className="appointment-reports-table">

        <thead>
          <tr>
            <th scope="col">Paciente</th>
            <th scope="col">Fecha</th>
            <th scope="col">Hora</th>
            <th scope="col">Servicio</th>
            <th scope="col">Duración</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>

              <td>
                <div className="appointment-report-patient">

                  <strong>
                    {appointment.patient?.name ||
                      'Paciente no disponible'}
                  </strong>

                  <span>
                    {appointment.patient?.phone ||
                      'Sin teléfono'}
                  </span>

                </div>
              </td>

              <td>
                {formatAppointmentDate(appointment.date)}
              </td>

              <td>
                <strong>{appointment.time}</strong>
              </td>

              <td>{appointment.service}</td>

              <td>{appointment.duration} min</td>

              <td>
                <AppointmentStatus
                  status={appointment.status}
                />
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}

// ==========================================
// TARJETAS MÓVILES
// ==========================================

function AppointmentReportsMobile({ appointments }) {
  return (
    <div className="appointment-reports-mobile-list">

      {appointments.map((appointment) => (
        <article
          key={appointment.id}
          className="appointment-reports-mobile-card"
        >

          <div className="appointment-reports-mobile-heading">

            <div className="appointment-reports-mobile-icon">
              <UserRound size={22} strokeWidth={1.8} />
            </div>

            <AppointmentStatus
              status={appointment.status}
            />

          </div>

          <h4>
            {appointment.patient?.name ||
              'Paciente no disponible'}
          </h4>

          <p className="appointment-reports-mobile-service">
            {appointment.service}
          </p>

          <div className="appointment-reports-mobile-details">

            <div>
              <span>Fecha</span>

              <strong>
                {formatAppointmentDate(appointment.date)}
              </strong>
            </div>

            <div>
              <span>Hora</span>

              <strong>{appointment.time}</strong>
            </div>

            <div>
              <span>Duración</span>

              <strong>
                {appointment.duration} min
              </strong>
            </div>

          </div>

        </article>
      ))}

    </div>
  )
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function AppointmentReportsPreview({
  appointments = [],
  reportTitle = 'Citas generales',
  loading = false,
}) {
  return (
    <section
      className="appointment-reports-preview"
      aria-labelledby="appointment-reports-preview-title"
    >

      <div className="appointment-reports-preview-heading">

        <div>
          <span className="dashboard-panel-eyebrow">
            VISTA PREVIA
          </span>

          <h3 id="appointment-reports-preview-title">
            Resultados del reporte
          </h3>

          <p>{reportTitle}</p>
        </div>

        <div className="appointment-reports-counter">
          <ClipboardList size={19} strokeWidth={1.8} />

          <span>
            {appointments.length}{' '}
            {appointments.length === 1
              ? 'cita'
              : 'citas'}
          </span>
        </div>

      </div>

      {loading ? (
        <div
          className="appointment-reports-loading"
          role="status"
        >
          <CalendarDays size={30} strokeWidth={1.7} />

          <p>Cargando citas...</p>
        </div>
      ) : appointments.length === 0 ? (
        <AppointmentReportsEmpty />
      ) : (
        <>
          <AppointmentReportsTable
            appointments={appointments}
          />

          <AppointmentReportsMobile
            appointments={appointments}
          />
        </>
      )}

      {!loading && appointments.length > 0 && (
        <div className="appointment-reports-preview-footer">

          <span>
            Mostrando{' '}
            <strong>{appointments.length}</strong>{' '}
            {appointments.length === 1
              ? 'cita'
              : 'citas'}
          </span>

          <span>
            Datos obtenidos del módulo de citas
          </span>

        </div>
      )}

    </section>
  )
}

export default AppointmentReportsPreview