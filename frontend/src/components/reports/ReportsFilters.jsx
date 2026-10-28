import {
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import {
  inventoryReportTypes,
} from '../../utils/reports/reportFilters'

function ReportsFilters({
  reportType,
  category,
  search,
  categories,
  onReportTypeChange,
  onCategoryChange,
  onSearchChange,
  onClearFilters,
}) {
  const hasActiveFilters =
    reportType !== 'general' ||
    category !== 'Todas' ||
    search.trim() !== ''

  return (
    <section
      className="reports-filters-panel"
      aria-labelledby="reports-filters-title"
    >
      <div className="reports-filters-heading">

        <div>
          <span className="dashboard-panel-eyebrow">
            CONFIGURACIÓN
          </span>

          <h3 id="reports-filters-title">
            Configurar reporte de inventario
          </h3>

          <p>
            Selecciona los criterios para consultar
            los productos del inventario.
          </p>
        </div>

        <SlidersHorizontal
          size={24}
          strokeWidth={1.8}
          aria-hidden="true"
        />

      </div>

      <div className="reports-filters-grid">

        {/* TIPO DE REPORTE */}

        <div className="reports-filter-field">

          <label htmlFor="reports-inventory-type">
            Tipo de reporte
          </label>

          <select
            id="reports-inventory-type"
            value={reportType}
            onChange={(event) =>
              onReportTypeChange(event.target.value)
            }
          >
            {inventoryReportTypes.map((type) => (
              <option
                key={type.id}
                value={type.id}
                disabled={type.disabled}
              >
                {type.label}
                {type.disabled ? ' (Próximamente)' : ''}
              </option>
            ))}
          </select>

        </div>

        {/* CATEGORÍA */}

        <div className="reports-filter-field">

          <label htmlFor="reports-inventory-category">
            Categoría
          </label>

          <select
            id="reports-inventory-category"
            value={category}
            onChange={(event) =>
              onCategoryChange(event.target.value)
            }
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === 'Todas'
                  ? 'Todas las categorías'
                  : item}
              </option>
            ))}
          </select>

        </div>

        {/* BÚSQUEDA */}

        <div className="reports-filter-field">

          <label htmlFor="reports-inventory-search">
            Buscar producto
          </label>

          <div className="reports-filter-search">

            <Search
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              id="reports-inventory-search"
              type="search"
              placeholder="Nombre, código o marca..."
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
            />

          </div>

        </div>

      </div>

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

export default ReportsFilters