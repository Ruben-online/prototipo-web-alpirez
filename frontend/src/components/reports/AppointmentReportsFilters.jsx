import {
  CalendarDays,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import {
  appointmentReportTypes,
  appointmentStatuses,
} from '../../utils/reports/appointmentReportFilters'

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function AppointmentReportsFilters({
  reportType,
  status,
  startDate,
  endDate,
  search,
  onReportTypeChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onSearchChange,
  onClearFilters,
}) {
  // ==========================================
  // VALIDACIONES
  // ==========================================

  const invalidDateRange =
    Boolean(startDate && endDate && startDate > endDate)

  const requiresDateRange = reportType === 'period'

  const missingDateRange =
    requiresDateRange && (!startDate || !endDate)

  const hasActiveFilters =
    reportType !== 'general' ||
    status !== 'Todos' ||
    startDate !== '' ||
    endDate !== '' ||
    search.trim() !== ''

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <section
      className="reports-filters-panel"
      aria-labelledby="appointment-reports-filters-title"
    >

      {/* ENCABEZADO */}

      <div className="reports-filters-heading">

        <div>
          <span className="dashboard-panel-eyebrow">
            CONFIGURACIÓN
          </span>

          <h3 id="appointment-reports-filters-title">
            Configurar reporte de citas
          </h3>

          <p>
            Selecciona los criterios para consultar
            la actividad de la agenda.
          </p>
        </div>

        <SlidersHorizontal
          size={24}
          strokeWidth={1.8}
          aria-hidden="true"
        />

      </div>

      {/* FILTROS */}

      <div className="reports-filters-grid">

        {/* TIPO DE REPORTE */}

        <div className="reports-filter-field">

          <label htmlFor="appointment-report-type">
            Tipo de reporte
          </label>

          <select
            id="appointment-report-type"
            value={reportType}
            onChange={(event) =>
              onReportTypeChange(event.target.value)
            }
          >
            {appointmentReportTypes.map((type) => (
              <option
                key={type.id}
                value={type.id}
              >
                {type.label}
              </option>
            ))}
          </select>

        </div>

        {/* ESTADO */}

        {['general', 'period'].includes(reportType) && (
          <div className="reports-filter-field">

            <label htmlFor="appointment-report-status">
              Estado de la cita
            </label>

            <select
              id="appointment-report-status"
              value={status}
              onChange={(event) =>
                onStatusChange(event.target.value)
              }
            >
              {appointmentStatuses.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === 'Todos'
                    ? 'Todos los estados'
                    : item}
                </option>
              ))}
            </select>

          </div>
        )}

        {/* FECHA INICIAL */}

        <div className="reports-filter-field">

          <label htmlFor="appointment-report-start-date">
            Fecha inicial
          </label>

          <div className="reports-filter-date">

            <CalendarDays
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              id="appointment-report-start-date"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) =>
                onStartDateChange(event.target.value)
              }
              aria-invalid={invalidDateRange}
            />

          </div>

        </div>

        {/* FECHA FINAL */}

        <div className="reports-filter-field">

          <label htmlFor="appointment-report-end-date">
            Fecha final
          </label>

          <div className="reports-filter-date">

            <CalendarDays
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              id="appointment-report-end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) =>
                onEndDateChange(event.target.value)
              }
              aria-invalid={invalidDateRange}
            />

          </div>

        </div>

        {/* BÚSQUEDA */}

        <div className="reports-filter-field">

          <label htmlFor="appointment-report-search">
            Buscar paciente o servicio
          </label>

          <div className="reports-filter-search">

            <Search
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              id="appointment-report-search"
              type="search"
              placeholder="Nombre o servicio..."
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
            />

          </div>

        </div>

      </div>

      {/* VALIDACIÓN DE FECHAS */}

      {invalidDateRange && (
        <p
          className="appointment-reports-date-error"
          role="alert"
        >
          La fecha inicial no puede ser posterior
          a la fecha final.
        </p>
      )}

      {!invalidDateRange && missingDateRange && (
        <p
          className="appointment-reports-date-hint"
          role="status"
        >
          Selecciona ambas fechas para consultar
          las citas de un período específico.
        </p>
      )}

      {/* LIMPIAR FILTROS */}

      {hasActiveFilters && (
        <div className="reports-filters-footer">

          <button
            type="button"
            className="reports-clear-filters"
            onClick={onClearFilters}
          >
            <X size={17} strokeWidth={1.8} />
            Limpiar filtros
          </button>

        </div>
      )}

    </section>
  )
}

export default AppointmentReportsFilters