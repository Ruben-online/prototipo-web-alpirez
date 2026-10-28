import {
  Boxes,
  ClipboardList,
  PackageX,
} from 'lucide-react'

import {
  getInventoryStatus,
} from '../../data/inventoryMock'

// ==========================================
// REPORTS - INVENTORY STATUS
// ==========================================

function InventoryStatus({ product }) {
  const status = getInventoryStatus(product)

  return (
    <span
      className={`reports-preview-status ${status.type}`}
    >
      <span
        className="reports-preview-status-dot"
        aria-hidden="true"
      />

      {status.label}
    </span>
  )
}

// ==========================================
// REPORTS - EMPTY STATE
// ==========================================

function ReportsEmptyState() {
  return (
    <div className="reports-preview-empty">

      <div className="reports-preview-empty-icon">
        <PackageX size={32} strokeWidth={1.7} />
      </div>

      <h4>No se encontraron productos</h4>

      <p>
        No hay productos que coincidan con los
        criterios seleccionados. Prueba modificando
        los filtros de búsqueda.
      </p>

    </div>
  )
}

// ==========================================
// REPORTS - DESKTOP TABLE
// ==========================================

function ReportsDesktopTable({ products }) {
  return (
    <div className="reports-preview-table-wrapper">

      <table className="reports-preview-table">

        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Producto</th>
            <th scope="col">Categoría</th>
            <th scope="col">Existencias</th>
            <th scope="col">Stock mínimo</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>

              <td>
                <span className="reports-preview-code">
                  {product.code}
                </span>
              </td>

              <td>
                <div className="reports-preview-product">

                  <strong>{product.name}</strong>

                  <span>
                    {product.brand || 'Sin marca'}
                  </span>

                </div>
              </td>

              <td>
                {product.category}
              </td>

              <td>
                <strong className="reports-preview-stock">
                  {product.stock}
                </strong>

                <span className="reports-preview-unit">
                  {product.unit}
                </span>
              </td>

              <td>
                {product.minStock}
              </td>

              <td>
                <InventoryStatus product={product} />
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}

// ==========================================
// REPORTS - MOBILE CARDS
// ==========================================

function ReportsMobileCards({ products }) {
  return (
    <div className="reports-preview-mobile-list">

      {products.map((product) => (
        <article
          key={product.id}
          className="reports-preview-mobile-card"
        >

          <div className="reports-preview-mobile-heading">

            <div className="reports-preview-mobile-icon">
              <Boxes size={21} strokeWidth={1.8} />
            </div>

            <span className="reports-preview-code">
              {product.code}
            </span>

          </div>

          <div className="reports-preview-mobile-product">

            <h4>{product.name}</h4>

            <p>
              {product.brand || 'Sin marca'}
            </p>

          </div>

          <div className="reports-preview-mobile-details">

            <div>
              <span>Categoría</span>
              <strong>{product.category}</strong>
            </div>

            <div>
              <span>Existencias</span>
              <strong>
                {product.stock} {product.unit}
              </strong>
            </div>

            <div>
              <span>Stock mínimo</span>
              <strong>{product.minStock}</strong>
            </div>

          </div>

          <div className="reports-preview-mobile-footer">

            <span>Estado del producto</span>

            <InventoryStatus product={product} />

          </div>

        </article>
      ))}

    </div>
  )
}

// ==========================================
// REPORTS - MAIN COMPONENT
// ==========================================

function ReportsPreview({
  products = [],
  reportTitle = 'Inventario general',
}) {
  const totalProducts = products.length

  return (
    <section
      className="reports-preview"
      aria-labelledby="reports-preview-title"
    >

      {/* ENCABEZADO */}

      <div className="reports-preview-heading">

        <div>
          <span className="dashboard-panel-eyebrow">
            VISTA PREVIA
          </span>

          <h3 id="reports-preview-title">
            Resultados del reporte
          </h3>

          <p>
            {reportTitle}
          </p>
        </div>

        <div className="reports-preview-counter">
          <ClipboardList size={18} strokeWidth={1.8} />

          <span>
            {totalProducts}{' '}
            {totalProducts === 1
              ? 'producto'
              : 'productos'}
          </span>
        </div>

      </div>

      {/* RESULTADOS */}

      {totalProducts === 0 ? (
        <ReportsEmptyState />
      ) : (
        <>
          <ReportsDesktopTable products={products} />

          <ReportsMobileCards products={products} />
        </>
      )}

      {/* PIE DE RESULTADOS */}

      {totalProducts > 0 && (
        <div className="reports-preview-footer">

          <span>
            Mostrando{' '}
            <strong>{totalProducts}</strong>{' '}
            {totalProducts === 1
              ? 'producto'
              : 'productos'}
          </span>

          <span>
            Datos de demostración
          </span>

        </div>
      )}

    </section>
  )
}

export default ReportsPreview