import { useEffect, useState } from 'react'

import {
  X,
  PackagePlus,
  Pencil,
  Save,
} from 'lucide-react'

import '../../styles/inventory/inventory-form-modal.css'

// ==========================================
// CONSTANTES
// ==========================================

const emptyForm = {
  code: '',
  name: '',
  category: '',
  brand: '',
  unit: '',
  minStock: '',
  price: '',
}

const categories = [
  'Dermatológicos',
  'Insumos médicos',
  'Productos para procedimientos',
]

const units = [
  'Unidad',
  'Caja',
  'Paquete',
  'Frasco',
  'Tubo',
  'Ampolla',
  'Mililitro',
  'Gramo',
]

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function InventoryFormModal({
  isOpen,
  product,
  onClose,
  onSubmit,
}) {

  // ==========================================
  // MODO DEL FORMULARIO
  // ==========================================

  const isEditing = Boolean(product)

  // ==========================================
  // ESTADOS
  // ==========================================

  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ==========================================
  // INICIALIZAR FORMULARIO
  // ==========================================

  useEffect(() => {
    if (!isOpen) return

    if (product) {
      setForm({
        code: product.code || '',
        name: product.name || '',
        category: product.category || '',
        brand: product.brand || '',
        unit: product.unit || '',
        minStock: String(product.minStock ?? ''),
        price: String(product.price ?? ''),
      })
    } else {
      setForm({ ...emptyForm })
    }

    setFormError('')
    setIsSubmitting(false)
  }, [isOpen, product])

  // ==========================================
  // BLOQUEAR SCROLL Y CERRAR CON ESCAPE
  // ==========================================

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, isSubmitting])

  // ==========================================
  // CAMBIOS DEL FORMULARIO
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (formError) {
      setFormError('')
    }
  }

  // ==========================================
  // VALIDACIÓN DEL FORMULARIO
  // ==========================================

  const validateForm = () => {
    if (
      !form.code.trim() ||
      !form.name.trim() ||
      !form.category ||
      !form.unit ||
      form.minStock === ''
    ) {
      return 'Completa todos los campos obligatorios.'
    }

    if (form.name.trim().length < 3) {
      return 'Ingresa un nombre de producto válido.'
    }

    if (
      !Number.isInteger(Number(form.minStock)) ||
      !Number.isFinite(Number(form.minStock))
    ) {
      return 'El stock mínimo debe ser un número entero.'
    }

    if (Number(form.minStock) < 0) {
      return 'El stock mínimo no puede ser negativo.'
    }

    if (
      form.price !== '' &&
      (
        !Number.isFinite(Number(form.price)) ||
        Number(form.price) < 0
      )
    ) {
      return 'Ingresa un precio válido.'
    }

    return ''
  }

  // ==========================================
  // ENVÍO DEL FORMULARIO
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSubmitting) return

    const error = validateForm()

    if (error) {
      setFormError(error)
      return
    }

    const productData = {
      code: form.code.trim(),
      name: form.name.trim(),
      category: form.category,
      brand: form.brand.trim(),
      unit: form.unit,
      minStock: Number(form.minStock),
      price: form.price === ''
        ? null
        : Number(form.price),
    }

    try {
      setIsSubmitting(true)
      setFormError('')

      // ==========================================
      // ENTREGA DE DATOS AL COMPONENTE PADRE
      // ==========================================

      // El formulario no almacena información.
      // Únicamente entrega los datos mediante onSubmit.
      // La página principal administra la demostración.
      // La integración real corresponde al backend.

      await onSubmit(productData)

    } catch (error) {

      // ==========================================
      // MOSTRAR ERRORES ESPECÍFICOS
      // ==========================================

      setFormError(
        error instanceof Error
          ? error.message
          : 'No se pudo completar la operación. Inténtalo nuevamente.'
      )

    } finally {
      setIsSubmitting(false)
    }
  }

  // ==========================================
  // RENDERIZADO
  // ==========================================

  if (!isOpen) return null

  return (
    <div
      className="inventory-form-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose()
        }
      }}
    >

      <section
        className="inventory-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inventory-form-title"
      >

        {/* ==========================================
            ENCABEZADO
        ========================================== */}

        <header className="inventory-form-header">

          <div className="inventory-form-heading">

            <div className="inventory-form-icon">

              {isEditing ? (
                <Pencil size={22} strokeWidth={1.8} />
              ) : (
                <PackagePlus size={22} strokeWidth={1.8} />
              )}

            </div>

            <div>

              <span className="dashboard-panel-eyebrow">
                GESTIÓN DE INVENTARIO
              </span>

              <h2 id="inventory-form-title">
                {isEditing
                  ? 'Editar producto'
                  : 'Nuevo producto'}
              </h2>

            </div>

          </div>

          <button
            type="button"
            className="inventory-form-close"
            aria-label="Cerrar formulario"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>

        </header>

        {/* ==========================================
            FORMULARIO
        ========================================== */}

        <form
          id="inventory-product-form"
          onSubmit={handleSubmit}
          className="inventory-form-body"
        >

          <p className="inventory-form-description">
            {isEditing
              ? 'Modifica la información general del producto.'
              : 'Completa la información para registrar un nuevo producto en el inventario.'}
          </p>

          {/* ==========================================
              INFORMACIÓN GENERAL
          ========================================== */}

          <div className="inventory-form-section">

            <h3>Información general</h3>

            <div className="inventory-form-grid">

              {/* CÓDIGO */}

              <div className="inventory-form-field">

                <label htmlFor="inventory-code">
                  Código <span>*</span>
                </label>

                <input
                  id="inventory-code"
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="Ej. PROD-001"
                  maxLength={30}
                  required
                />

              </div>

              {/* NOMBRE */}

              <div className="inventory-form-field">

                <label htmlFor="inventory-name">
                  Nombre del producto <span>*</span>
                </label>

                <input
                  id="inventory-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                  required
                />

              </div>

              {/* CATEGORÍA */}

              <div className="inventory-form-field">

                <label htmlFor="inventory-category-field">
                  Categoría <span>*</span>
                </label>

                <select
                  id="inventory-category-field"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Seleccionar categoría
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}

                </select>

              </div>

              {/* MARCA */}

              <div className="inventory-form-field">

                <label htmlFor="inventory-brand">
                  Marca
                </label>

                <input
                  id="inventory-brand"
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Marca del producto"
                />

              </div>

            </div>

          </div>

          {/* ==========================================
              INFORMACIÓN DE INVENTARIO
          ========================================== */}

          <div className="inventory-form-section">

            <h3>Información de inventario</h3>

            <div className="inventory-form-grid">

              {/* UNIDAD DE MEDIDA */}

              <div className="inventory-form-field">

                <label htmlFor="inventory-unit">
                  Unidad de medida <span>*</span>
                </label>

                <select
                  id="inventory-unit"
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Seleccionar unidad
                  </option>

                  {units.map((unit) => (
                    <option
                      key={unit}
                      value={unit}
                    >
                      {unit}
                    </option>
                  ))}

                </select>

              </div>

              {/* STOCK MÍNIMO */}

              <div className="inventory-form-field">

                <label htmlFor="inventory-min-stock">
                  Stock mínimo <span>*</span>
                </label>

                <input
                  id="inventory-min-stock"
                  type="number"
                  name="minStock"
                  value={form.minStock}
                  onChange={handleChange}
                  placeholder="Ej. 5"
                  min="0"
                  step="1"
                  required
                />

              </div>

              {/* PRECIO */}

              <div className="inventory-form-field">

                <label htmlFor="inventory-price">
                  Precio unitario (Q)
                </label>

                <input
                  id="inventory-price"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Ej. 185.00"
                  min="0"
                  step="0.01"
                />

              </div>

            </div>

          </div>

          {/* ==========================================
              MENSAJE DE ERROR
          ========================================== */}

          {formError && (
            <div
              className="inventory-form-error"
              role="alert"
            >
              {formError}
            </div>
          )}

          {/* ==========================================
              NOTA
          ========================================== */}

          <p className="inventory-form-note">
            Los campos marcados con * son obligatorios.
          </p>

        </form>

        {/* ==========================================
            ACCIONES
        ========================================== */}

        <footer className="inventory-form-footer">

          <button
            type="button"
            className="inventory-form-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="inventory-product-form"
            className="inventory-form-submit"
            disabled={isSubmitting}
          >
            <Save size={17} strokeWidth={1.8} />

            {isSubmitting
              ? 'Procesando...'
              : isEditing
                ? 'Guardar cambios'
                : 'Registrar producto'}
          </button>

        </footer>

      </section>

    </div>
  )
}

export default InventoryFormModal