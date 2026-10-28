import {
  Eye,
  Pencil,
  Package,
} from 'lucide-react'

import { getInventoryStatus } from '../../data/inventoryMock'

import '../../styles/inventory/inventory-table.css'

// ==========================================
// FORMATO DE MONEDA
// ==========================================

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  }).format(value || 0) // <-- Aseguramos que siempre formatee un número

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function InventoryTable({
  products,
  onView,
  onEdit,
}) {
  if (products.length === 0) {
    return (
      <div className="inventory-table-empty">
        <Package size={32} strokeWidth={1.5} />
        <h4>No se encontraron productos</h4>
        <p>No hay productos que coincidan con tu búsqueda.</p>
      </div>
    )
  }

  return (
    <>
      {/* ==========================================
          TABLA - ESCRITORIO
      ========================================== */}
      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>PRODUCTO</th>
              <th>CATEGORÍA</th>
              <th>EXISTENCIAS</th>
              <th>STOCK MÍNIMO</th>
              <th>PRECIO</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const status = getInventoryStatus(product)

              return (
                <tr key={product.id}>
                  {/* PRODUCTO */}
                  <td>
                    <div className="inventory-product">
                      <div className="inventory-product-icon">
                        <Package size={19} strokeWidth={1.8} />
                      </div>
                      <div className="inventory-product-info">
                        <strong>{product.name}</strong>
                        <span>{product.code}</span>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORÍA */}
                  <td>
                    <span className="inventory-category">
                      {product.categoryName} {/* <-- CORREGIDO */}
                    </span>
                  </td>

                  {/* EXISTENCIAS */}
                  <td>
                    <div className="inventory-stock">
                      <strong>{product.stock}</strong>
                      <span>{product.unitName}</span> {/* <-- CORREGIDO */}
                    </div>
                  </td>

                  {/* STOCK MÍNIMO */}
                  <td>
                    <span className="inventory-min-stock">
                      {product.minStock}
                    </span>
                  </td>

                  {/* PRECIO */}
                  <td>
                    <span className="inventory-price">
                      {formatCurrency(product.unitPrice)} {/* <-- CORREGIDO */}
                    </span>
                  </td>

                  {/* ESTADO */}
                  <td>
                    <span className={`inventory-status ${status.type}`}>
                      <span className="inventory-status-dot" />
                      {status.label}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td>
                    <div className="inventory-row-actions">
                      <button
                        type="button"
                        className="inventory-action-button"
                        onClick={() => onView(product)}
                        aria-label={`Ver ${product.name}`}
                        title="Ver producto"
                      >
                        <Eye size={17} strokeWidth={1.8} />
                      </button>

                      <button
                        type="button"
                        className="inventory-action-button"
                        onClick={() => onEdit(product)}
                        aria-label={`Editar ${product.name}`}
                        title="Editar producto"
                      >
                        <Pencil size={16} strokeWidth={1.8} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ==========================================
          TARJETAS - MÓVIL
      ========================================== */}
      <div className="inventory-mobile-list">
        {products.map((product) => {
          const status = getInventoryStatus(product)

          return (
            <article className="inventory-mobile-card" key={product.id}>
              <div className="inventory-mobile-card-header">
                <div className="inventory-product-icon">
                  <Package size={19} />
                </div>
                <span className={`inventory-status ${status.type}`}>
                  <span className="inventory-status-dot" />
                  {status.label}
                </span>
              </div>

              <h4>{product.name}</h4>
              <span className="inventory-mobile-code">{product.code}</span>

              <div className="inventory-mobile-details">
                <div>
                  <span>Categoría</span>
                  <strong>{product.categoryName}</strong> {/* <-- CORREGIDO */}
                </div>
                <div>
                  <span>Existencias</span>
                  <strong>{product.stock} {product.unitName}</strong> {/* <-- CORREGIDO */}
                </div>
                <div>
                  <span>Stock mínimo</span>
                  <strong>{product.minStock}</strong>
                </div>
                <div>
                  <span>Precio</span>
                  <strong>{formatCurrency(product.unitPrice)}</strong> {/* <-- CORREGIDO */}
                </div>
              </div>

              <div className="inventory-mobile-actions">
                <button type="button" onClick={() => onView(product)}>
                  <Eye size={16} /> Ver detalles
                </button>
                <button type="button" onClick={() => onEdit(product)}>
                  <Pencil size={16} /> Editar
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

export default InventoryTable