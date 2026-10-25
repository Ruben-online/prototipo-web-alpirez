import { useEffect } from 'react'

import {
  X,
  Package,
  Tag,
  Boxes,
  AlertTriangle,
  Wallet,
} from 'lucide-react'

import { getInventoryStatus } from '../../data/inventoryMock'

import '../../styles/inventory/inventory-details-modal.css'

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  }).format(value)

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function InventoryDetailsModal({ product, onClose }) {

  // ==========================================
  // CERRAR CON ESCAPE Y BLOQUEAR SCROLL
  // ==========================================

  useEffect(() => {
    if (!product) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [product, onClose])

  if (!product) return null

  const status = getInventoryStatus(product)

  return (
    <div
      className="inventory-details-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        className="inventory-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inventory-details-title"
      >

        {/* ENCABEZADO */}

        <header className="inventory-details-header">

          <div className="inventory-details-heading">
            <div className="inventory-details-icon">
              <Package size={23} strokeWidth={1.8} />
            </div>

            <div>
              <span className="dashboard-panel-eyebrow">
                INFORMACIÓN DEL PRODUCTO
              </span>

              <h2 id="inventory-details-title">
                Detalles del producto
              </h2>
            </div>
          </div>

          <button
            type="button"
            className="inventory-details-close"
            aria-label="Cerrar detalles"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </header>

        {/* CONTENIDO */}

        <div className="inventory-details-body">

          <div className="inventory-details-product">

            <div>
              <span className="inventory-details-code">
                {product.code}
              </span>

              <h3>{product.name}</h3>

              <p>{product.category}</p>
            </div>

            <span className={`inventory-status ${status.type}`}>
              <span className="inventory-status-dot" />
              {status.label}
            </span>

          </div>

          {/* INFORMACIÓN GENERAL */}

          <div className="inventory-details-section">

            <div className="inventory-details-section-title">
              <Tag size={17} />
              <h4>Información general</h4>
            </div>

            <div className="inventory-details-grid">

              <div>
                <span>Código</span>
                <strong>{product.code}</strong>
              </div>

              <div>
                <span>Categoría</span>
                <strong>{product.category}</strong>
              </div>

              <div>
                <span>Marca</span>
                <strong>{product.brand || 'No especificada'}</strong>
              </div>

              <div>
                <span>Unidad de medida</span>
                <strong>{product.unit}</strong>
              </div>

            </div>

          </div>

          {/* EXISTENCIAS */}

          <div className="inventory-details-section">

            <div className="inventory-details-section-title">
              <Boxes size={17} />
              <h4>Control de existencias</h4>
            </div>

            <div className="inventory-details-grid">

              <div>
                <span>Existencias disponibles</span>
                <strong>
                  {product.stock} {product.unit}
                </strong>
              </div>

              <div>
                <span>Stock mínimo</span>
                <strong>{product.minStock}</strong>
              </div>

            </div>

            {status.type !== 'available' && (
              <div className="inventory-details-warning">
                <AlertTriangle size={17} />

                <span>
                  {status.type === 'out'
                    ? 'Este producto no tiene existencias disponibles.'
                    : 'Este producto se encuentra por debajo o en su nivel mínimo de existencias.'}
                </span>
              </div>
            )}

          </div>

          {/* PRECIO */}

          <div className="inventory-details-section">

            <div className="inventory-details-section-title">
              <Wallet size={17} />
              <h4>Información comercial</h4>
            </div>

            <div className="inventory-details-grid">

              <div>
                <span>Precio unitario</span>
                <strong>
                  {product.price == null
                    ? 'No especificado'
                    : formatCurrency(product.price)}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* PIE */}

        <footer className="inventory-details-footer">
          <button
            type="button"
            className="inventory-details-done"
            onClick={onClose}
          >
            Cerrar
          </button>
        </footer>

      </section>
    </div>
  )
}

export default InventoryDetailsModal