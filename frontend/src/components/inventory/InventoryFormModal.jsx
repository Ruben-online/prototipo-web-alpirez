import CreateAttributeModal from '../../context/CreateAttributeModal'
import { useInventory } from '../../hooks/useInventory'
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
  categoryId: '',
  brandId: '',
  unitId: '',
  stock: '0', 
  minStock: '',
  price: '',
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function InventoryFormModal({
  isOpen,
  product,
  onClose,
  onSubmit,
}) {
  const { 
    categories, 
    brands, 
    units, 
    refreshCategories, 
    refreshBrands, 
    refreshUnits 
  } = useInventory()

  const isEditing = Boolean(product)

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
        categoryId: product.categoryId || '',
        brandId: product.brandId || '',
        unitId: product.unitId || '',
        stock: String(product.stock ?? '0'),
        minStock: String(product.minStock ?? ''),
        price: String(product.unitPrice ?? ''),
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
  // VALIDACIÓN Y ENVÍO
  // ==========================================

  const validateForm = () => {
    if (
      !form.code.trim() ||
      !form.name.trim() ||
      !form.categoryId ||
      !form.unitId ||
      form.minStock === ''
    ) {
      return 'Completa todos los campos obligatorios.'
    }

    if (form.name.trim().length < 3) {
      return 'Ingresa un nombre de producto válido.'
    }

    if (!Number.isInteger(Number(form.minStock)) || Number(form.minStock) < 0) {
      return 'El stock mínimo debe ser un número entero válido.'
    }

    if (form.price !== '' && (!Number.isFinite(Number(form.price)) || Number(form.price) < 0)) {
      return 'Ingresa un precio válido.'
    }

    return ''
  }

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
      categoryId: form.categoryId,
      brandId: form.brandId || null,
      unitId: form.unitId,
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      unitPrice: form.price === '' ? 0 : Number(form.price),
    }

    try {
      setIsSubmitting(true)
      setFormError('')
      await onSubmit(productData)
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'No se pudo completar la operación.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="inventory-form-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose()
      }}
    >
      <section className="inventory-form-modal" role="dialog">
        <header className="inventory-form-header">
          <div className="inventory-form-heading">
            <div className="inventory-form-icon">
              {isEditing ? <Pencil size={22} /> : <PackagePlus size={22} />}
            </div>
            <div>
              <span className="dashboard-panel-eyebrow">GESTIÓN DE INVENTARIO</span>
              <h2>{isEditing ? 'Editar producto' : 'Nuevo producto'}</h2>
            </div>
          </div>
          <button type="button" className="inventory-form-close" onClick={onClose} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </header>

        <form id="inventory-product-form" onSubmit={handleSubmit} className="inventory-form-body">
          
          {/* SECCIÓN GENERAL */}
          <div className="inventory-form-section">
            <h3>Información general</h3>
            <div className="inventory-form-grid">
              
              <div className="inventory-form-field">
                <label>Código <span>*</span></label>
                <input type="text" name="code" value={form.code} onChange={handleChange} required />
              </div>

              <div className="inventory-form-field">
                <label>Nombre del producto <span>*</span></label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div className="inventory-form-field">
                <label>Categoría <span>*</span></label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select name="categoryId" value={form.categoryId} onChange={handleChange} required style={{ flex: 1 }}>
                    <option value="">Seleccionar</option>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <CreateAttributeModal type="categories" title="Categoría" onSuccess={refreshCategories} />
                </div>
              </div>

              <div className="inventory-form-field">
                <label>Marca</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select name="brandId" value={form.brandId} onChange={handleChange} style={{ flex: 1 }}>
                    <option value="">Seleccionar (Opcional)</option>
                    {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <CreateAttributeModal type="brands" title="Marca" onSuccess={refreshBrands} />
                </div>
              </div>

            </div>
          </div>

          {/* SECCIÓN INVENTARIO */}
          <div className="inventory-form-section">
            <h3>Información de inventario</h3>
            <div className="inventory-form-grid">
              
              <div className="inventory-form-field">
                <label>Unidad de medida <span>*</span></label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select name="unitId" value={form.unitId} onChange={handleChange} required style={{ flex: 1 }}>
                    <option value="">Seleccionar unidad</option>
                    {units?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                  <CreateAttributeModal type="units" title="Unidad" onSuccess={refreshUnits} />
                </div>
              </div>

              <div className="inventory-form-field">
                <label>Stock inicial (Opcional)</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" step="1" />
              </div>

              <div className="inventory-form-field">
                <label>Stock mínimo <span>*</span></label>
                <input type="number" name="minStock" value={form.minStock} onChange={handleChange} min="0" step="1" required />
              </div>

              <div className="inventory-form-field">
                <label>Precio unitario (Q)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" />
              </div>

            </div>
          </div>

          {formError && <div className="inventory-form-error" role="alert">{formError}</div>}
          <p className="inventory-form-note">Los campos marcados con * son obligatorios.</p>
        </form>

        <footer className="inventory-form-footer">
          <button type="button" className="inventory-form-cancel" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
          <button type="submit" form="inventory-product-form" className="inventory-form-submit" disabled={isSubmitting}>
            <Save size={17} strokeWidth={1.8} />
            {isSubmitting ? 'Procesando...' : isEditing ? 'Guardar cambios' : 'Registrar producto'}
          </button>
        </footer>
      </section>
    </div>
  )
}

export default InventoryFormModal