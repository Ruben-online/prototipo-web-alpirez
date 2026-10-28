import {
  CalendarDays,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import {
  patientReportTypes,
  patientStatuses,
} from '../../utils/reports/patientReportFilters'

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function PatientReportsFilters({
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

  const invalidDateRange = Boolean(
    startDate &&
    endDate &&
    startDate > endDate
  )

  const requiresDateRange = reportType === 'new'

  const missingDateRange =
    requiresDateRange &&
    (!startDate || !endDate)

  const hasActiveFilters =
    reportType !== 'general' ||
    status !== 'Todos' ||
    startDate !== '' ||
    endDate !== '' ||
    search.trim() !== ''

  const showStatusFilter = [
    'general',
    'new',
    'summary',
  ].includes(reportType)

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <section
      className="reports-filters-panel"
      aria-labelledby="patient-reports-filters-title"
    >

      {/* ENCABEZADO */}

      <div className="reports-filters-heading">

        <div>
          <span className="dashboard-panel-eyebrow">
            CONFIGURACIÓN
          </span>

          <h3 id="patient-reports-filters-title">
            Configurar reporte de pacientes
          </h3>

          <p>
            Selecciona los criterios para consultar
            la información administrativa de los pacientes.
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

          <label htmlFor="patient-report-type">
            Tipo de reporte
          </label>

          <select
            id="patient-report-type"
            value={reportType}
            onChange={(event) =>
              onReportTypeChange(event.target.value)
            }
          >
            {patientReportTypes.map((type) => (
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

        {showStatusFilter && (
          <div className="reports-filter-field">

            <label htmlFor="patient-report-status">
              Estado del paciente
            </label>

            <select
              id="patient-report-status"
              value={status}
              onChange={(event) =>
                onStatusChange(event.target.value)
              }
            >
              {patientStatuses.map((item) => (
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

          <label htmlFor="patient-report-start-date">
            Fecha inicial de registro
          </label>

          <div className="reports-filter-date">

            <CalendarDays
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              id="patient-report-start-date"
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

          <label htmlFor="patient-report-end-date">
            Fecha final de registro
          </label>

          <div className="reports-filter-date">

            <CalendarDays
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              id="patient-report-end-date"
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

          <label htmlFor="patient-report-search">
            Buscar paciente
          </label>

          <div className="reports-filter-search">

            <Search
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              id="patient-report-search"
              type="search"
              placeholder="Nombre, correo o teléfono..."
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
          los pacientes registrados durante ese período.
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

export default PatientReportsFilters