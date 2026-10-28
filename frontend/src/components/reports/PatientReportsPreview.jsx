import {
  UsersRound,
  UserRoundCheck,
  UserRoundX,
  ClipboardList,
  CalendarDays,
  AlertCircle,
} from 'lucide-react'

import {
  getPatientReportSummary,
} from '../../utils/reports/patientReportFilters'

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function formatPatientDate(value) {
  if (!value) return 'Sin registro'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Fecha no disponible'
  }

  return new Intl.DateTimeFormat('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Guatemala',
  }).format(date)
}

// ==========================================
// ESTADO DEL PACIENTE
// ==========================================

function PatientStatus({ status }) {
  const statusClass =
    status === 'Activo'
      ? 'active'
      : status === 'Inactivo'
        ? 'inactive'
        : 'unknown'

  return (
    <span className={`patient-report-status ${statusClass}`}>
      <span
        className="patient-report-status-dot"
        aria-hidden="true"
      />
      {status || 'Sin estado'}
    </span>
  )
}

// ==========================================
// ESTADÍSTICAS
// ==========================================

function PatientReportsSummary({ patients }) {
  const summary = getPatientReportSummary(patients)

  const stats = [
    {
      label: 'Total de pacientes',
      value: summary.total,
      icon: UsersRound,
      type: 'primary',
    },
    {
      label: 'Pacientes activos',
      value: summary.active,
      icon: UserRoundCheck,
      type: 'success',
    },
    {
      label: 'Pacientes inactivos',
      value: summary.inactive,
      icon: UserRoundX,
      type: 'warning',
    },
    {
      label: 'Consultas registradas',
      value: summary.consultations,
      icon: CalendarDays,
      type: 'info',
    },
  ]

  return (
    <div className="patient-reports-stats">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <article
            key={stat.label}
            className={`patient-reports-stat-card ${stat.type}`}
          >
            <div className="patient-reports-stat-icon">
              <Icon size={24} strokeWidth={1.8} />
            </div>

            <div className="patient-reports-stat-content">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          </article>
        )
      })}
    </div>
  )
}

// ==========================================
// TABLA DE ESCRITORIO
// ==========================================

function PatientReportsTable({ patients }) {
  return (
    <div className="patient-reports-table-wrapper">
      <table className="patient-reports-table">
        <thead>
          <tr>
            <th scope="col">Paciente</th>
            <th scope="col">Correo electrónico</th>
            <th scope="col">Teléfono</th>
            <th scope="col">Registro</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>
                <strong>
                  {patient.name || 'Sin nombre'}
                </strong>
              </td>

              <td>{patient.email || 'No disponible'}</td>

              <td>{patient.phone || 'No disponible'}</td>

              <td>{formatPatientDate(patient.createdAt)}</td>

              <td>
                <PatientStatus status={patient.status} />
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

function PatientReportsMobile({ patients }) {
  return (
    <div className="patient-reports-mobile-list">
      {patients.map((patient) => (
        <article
          key={patient.id}
          className="patient-reports-mobile-card"
        >
          <div className="patient-reports-mobile-top">
            <div className="patient-reports-mobile-icon">
              <UsersRound size={22} strokeWidth={1.8} />
            </div>

            <PatientStatus status={patient.status} />
          </div>

          <h4>{patient.name || 'Sin nombre'}</h4>

          <div className="patient-reports-mobile-details">
            <div>
              <span>Correo</span>
              <strong>
                {patient.email || 'No disponible'}
              </strong>
            </div>

            <div>
              <span>Teléfono</span>
              <strong>
                {patient.phone || 'No disponible'}
              </strong>
            </div>

            <div>
              <span>Registro</span>
              <strong>
                {formatPatientDate(patient.createdAt)}
              </strong>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

// ==========================================
// ESTADOS INFORMATIVOS
// ==========================================

function PatientReportsMessage({ type, message }) {
  const isError = type === 'error'

  return (
    <div
      className={`patient-reports-message ${type}`}
      role={isError ? 'alert' : 'status'}
    >
      <div className="patient-reports-message-icon">
        {isError ? (
          <AlertCircle size={30} strokeWidth={1.7} />
        ) : (
          <UsersRound size={30} strokeWidth={1.7} />
        )}
      </div>

      <h4>
        {isError
          ? 'No fue posible cargar los pacientes'
          : type === 'loading'
            ? 'Cargando pacientes'
            : 'No se encontraron pacientes'}
      </h4>

      <p>{message}</p>
    </div>
  )
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function PatientReportsPreview({
  patients = [],
  reportTitle = 'Pacientes generales',
  loading = false,
  error = null,
  showSummary = false,
}) {
  const hasPatients = patients.length > 0

  return (
    <section
      className="patient-reports-preview"
      aria-labelledby="patient-reports-preview-title"
    >
      <div className="patient-reports-preview-heading">
        <div>
          <span className="dashboard-panel-eyebrow">
            VISTA PREVIA
          </span>

          <h3 id="patient-reports-preview-title">
            Resultados del reporte
          </h3>

          <p>{reportTitle}</p>
        </div>

        {!loading && !error && (
          <div className="patient-reports-counter">
            <ClipboardList size={19} strokeWidth={1.8} />

            <span>
              {patients.length}{' '}
              {patients.length === 1
                ? 'paciente'
                : 'pacientes'}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <PatientReportsMessage
          type="loading"
          message="Consultando la información de pacientes..."
        />
      ) : error ? (
        <PatientReportsMessage
          type="error"
          message="Verifica la conexión e intenta nuevamente."
        />
      ) : (
        <>
          {showSummary && (
            <PatientReportsSummary patients={patients} />
          )}

          {!hasPatients ? (
            <PatientReportsMessage
              type="empty"
              message="No hay pacientes que coincidan con los filtros seleccionados."
            />
          ) : (
            <>
              <PatientReportsTable patients={patients} />
              <PatientReportsMobile patients={patients} />
            </>
          )}

          <div className="patient-reports-preview-footer">
            <span>
              Mostrando{' '}
              <strong>{patients.length}</strong>{' '}
              {patients.length === 1
                ? 'paciente'
                : 'pacientes'}
            </span>

            <span>Información administrativa</span>
          </div>
        </>
      )}
    </section>
  )
}

export default PatientReportsPreview