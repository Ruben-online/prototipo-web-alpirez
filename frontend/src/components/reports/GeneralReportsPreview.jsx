import {
  UsersRound,
  UserRoundCheck,
  UserRoundX,
  UserRoundPlus,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  Clock3,
  Boxes,
  PackageCheck,
  PackageX,
  AlertTriangle,
  ClipboardList,
  LoaderCircle,
  AlertCircle,
} from 'lucide-react'

// ==========================================
// CONFIGURACIÓN DE INDICADORES
// ==========================================

const reportSections = [
  {
    id: 'patients',
    title: 'Pacientes',
    description: 'Información administrativa de pacientes.',
    icon: UsersRound,
    items: [
      {
        key: 'total',
        label: 'Total de pacientes',
        icon: UsersRound,
      },
      {
        key: 'active',
        label: 'Pacientes activos',
        icon: UserRoundCheck,
      },
      {
        key: 'inactive',
        label: 'Pacientes inactivos',
        icon: UserRoundX,
      },
      {
        key: 'newRegistrations',
        label: 'Nuevos registros',
        icon: UserRoundPlus,
      },
    ],
  },
  {
    id: 'appointments',
    title: 'Citas',
    description: 'Actividad y estados de las citas.',
    icon: CalendarDays,
    items: [
      {
        key: 'total',
        label: 'Total de citas',
        icon: CalendarDays,
      },
      {
        key: 'confirmed',
        label: 'Confirmadas',
        icon: Clock3,
      },
      {
        key: 'completed',
        label: 'Completadas',
        icon: CalendarCheck,
      },
      {
        key: 'cancelled',
        label: 'Canceladas',
        icon: CalendarX,
      },
      {
        key: 'missed',
        label: 'No asistieron',
        icon: UserRoundX,
      },
    ],
  },
  {
    id: 'inventory',
    title: 'Inventario',
    description:
      'Estado actual de los productos. Datos demostrativos.',
    icon: Boxes,
    items: [
      {
        key: 'total',
        label: 'Productos registrados',
        icon: Boxes,
      },
      {
        key: 'available',
        label: 'Disponibles',
        icon: PackageCheck,
      },
      {
        key: 'low',
        label: 'Stock bajo',
        icon: AlertTriangle,
      },
      {
        key: 'out',
        label: 'Agotados',
        icon: PackageX,
      },
    ],
  },
]

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

// Convertir YYYY-MM-DD a una fecha legible
// sin desplazamientos por zona horaria.

function formatReportDate(dateString) {
  if (!dateString) return ''

  const [year, month, day] = dateString
    .split('-')
    .map(Number)

  const date = new Date(year, month - 1, day)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

// ==========================================
// DESCRIPCIÓN DEL PERÍODO
// ==========================================

function getPeriodDescription(period) {
  const startDate = period?.startDate || ''
  const endDate = period?.endDate || ''

  if (!startDate && !endDate) {
    return 'Sin filtro de fechas · Información histórica disponible'
  }

  if (startDate && endDate) {
    return (
      `Del ${formatReportDate(startDate)} ` +
      `al ${formatReportDate(endDate)}`
    )
  }

  if (startDate) {
    return `Desde el ${formatReportDate(startDate)}`
  }

  return `Hasta el ${formatReportDate(endDate)}`
}

// ==========================================
// TARJETA DE INDICADOR
// ==========================================

function GeneralReportStat({
  label,
  value,
  icon: Icon,
}) {
  return (
    <article className="general-report-stat">
      <div className="general-report-stat-icon">
        <Icon
          size={21}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <div className="general-report-stat-info">
        <span>{label}</span>

        <strong>{value}</strong>
      </div>
    </article>
  )
}

// ==========================================
// SECCIÓN DE INDICADORES
// ==========================================

function GeneralReportSection({
  section,
  data,
  hasDateFilter,
}) {
  const Icon = section.icon

  return (
    <section
      className={`general-report-section general-report-${section.id}`}
      aria-labelledby={`general-report-section-${section.id}`}
    >
      {/* ENCABEZADO */}

      <div className="general-report-section-heading">
        <div className="general-report-section-title">
          <div className="general-report-section-icon">
            <Icon
              size={23}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div>
            <h4
              id={`general-report-section-${section.id}`}
            >
              {section.title}
            </h4>

            <p>{section.description}</p>
          </div>
        </div>

        {section.id === 'inventory' && (
          <span className="general-report-demo-badge">
            Datos de demostración
          </span>
        )}
      </div>

      {/* INDICADORES */}

      <div className="general-report-stats-grid">
        {section.items.map((item) => {
          let label = item.label

          // Aclarar qué representa el indicador
          // de registros de pacientes.

          if (
            section.id === 'patients' &&
            item.key === 'newRegistrations'
          ) {
            label = hasDateFilter
              ? 'Registros del período'
              : 'Registros históricos'
          }

          return (
            <GeneralReportStat
              key={item.key}
              label={label}
              value={data?.[item.key] ?? 0}
              icon={item.icon}
            />
          )
        })}
      </div>
    </section>
  )
}

// ==========================================
// ESTADOS INFORMATIVOS
// ==========================================

function GeneralReportMessage({ type }) {
  const isLoading = type === 'loading'

  return (
    <div
      className={`general-report-message ${type}`}
      role={isLoading ? 'status' : 'alert'}
    >
      {isLoading ? (
        <LoaderCircle
          size={30}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ) : (
        <AlertCircle
          size={30}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      )}

      <h4>
        {isLoading
          ? 'Cargando información'
          : 'No fue posible generar el reporte'}
      </h4>

      <p>
        {isLoading
          ? 'Consultando los datos disponibles de la clínica...'
          : 'Revisa la conexión e intenta nuevamente.'}
      </p>
    </div>
  )
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function GeneralReportsPreview({
  summary = null,
  loading = false,
  error = null,
}) {
  // ========================================
  // PERÍODO
  // ========================================

  const period = summary?.period

  const hasDateFilter = Boolean(
    period?.startDate || period?.endDate
  )

  const periodDescription =
    getPeriodDescription(period)

  // ========================================
  // INTERFAZ
  // ========================================

  return (
    <section
      className="general-reports-preview"
      aria-labelledby="general-reports-preview-title"
    >
      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <div className="general-reports-preview-heading">
        <div>
          <span className="dashboard-panel-eyebrow">
            VISTA PREVIA
          </span>

          <h3 id="general-reports-preview-title">
            Resumen general de la clínica
          </h3>

          <p>
            Indicadores administrativos de pacientes,
            citas e inventario.
          </p>
        </div>

        <div className="general-reports-preview-label">
          <ClipboardList
            size={19}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          Reporte general
        </div>
      </div>

      {/* ======================================
          CONTENIDO
      ====================================== */}

      {loading ? (
        <GeneralReportMessage type="loading" />
      ) : error || !summary ? (
        <GeneralReportMessage type="error" />
      ) : (
        <div className="general-reports-sections">

          {/* PERÍODO CONSULTADO */}

          <div
            className="general-report-note"
            role="note"
          >
            <strong>Período consultado:</strong>{' '}
            {periodDescription}
          </div>

          {/* PACIENTES */}

          <GeneralReportSection
            section={reportSections[0]}
            data={summary.patients}
            hasDateFilter={hasDateFilter}
          />

          {/* CITAS */}

          <GeneralReportSection
            section={reportSections[1]}
            data={summary.appointments}
            hasDateFilter={hasDateFilter}
          />

          {/* INVENTARIO */}

          <GeneralReportSection
            section={reportSections[2]}
            data={summary.inventory}
            hasDateFilter={hasDateFilter}
          />

          {/* NOTA INFORMATIVA */}

          <div
            className="general-report-note"
            role="note"
          >
            <strong>Información:</strong>{' '}
            Los totales de pacientes y el inventario
            representan el estado actual del sistema.

            {' '}Las citas y los registros de pacientes
            se calculan según el período seleccionado.

            {' '}El inventario utiliza datos de demostración
            hasta completar su integración.
          </div>

        </div>
      )}
    </section>
  )
}

export default GeneralReportsPreview