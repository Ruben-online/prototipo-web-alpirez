import {
  CalendarDays,
  SlidersHorizontal,
  X,
} from 'lucide-react'

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function GeneralReportsFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
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

  const hasActiveFilters = Boolean(
    startDate || endDate
  )

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <section
      className="reports-filters-panel"
      aria-labelledby="general-reports-filters-title"
    >
      {/* ENCABEZADO */}

      <div className="reports-filters-heading">
        <div>
          <span className="dashboard-panel-eyebrow">
            CONFIGURACIÓN
          </span>

          <h3 id="general-reports-filters-title">
            Configurar reporte general
          </h3>

          <p>
            Selecciona un período para consultar
            la actividad administrativa de la clínica.
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
        {/* FECHA INICIAL */}

        <div className="reports-filter-field">
          <label htmlFor="general-report-start-date">
            Fecha inicial
          </label>

          <div className="reports-filter-date">
            <CalendarDays
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              id="general-report-start-date"
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
          <label htmlFor="general-report-end-date">
            Fecha final
          </label>

          <div className="reports-filter-date">
            <CalendarDays
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              id="general-report-end-date"
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
      </div>

      {/* INFORMACIÓN SOBRE EL PERÍODO */}

      <p className="appointment-reports-date-hint">
        El período seleccionado se aplicará a las citas
        y a los nuevos registros de pacientes.
        El inventario mostrará su estado actual.
      </p>

      {/* ERROR DE VALIDACIÓN */}

      {invalidDateRange && (
        <p
          className="appointment-reports-date-error"
          role="alert"
        >
          La fecha inicial no puede ser posterior
          a la fecha final.
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

export default GeneralReportsFilters