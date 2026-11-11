import { useMemo, useState, useEffect, useRef } from 'react'
import { useInventory } from '../hooks/useInventory'

import {
  Package,
  PackageX,
  AlertTriangle,
  CalendarClock,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Upload // <-- Ícono nuevo
} from 'lucide-react'

import InventoryTable from '../components/inventory/InventoryTable'
import InventoryDetailsModal from '../components/inventory/InventoryDetailsModal'
import InventoryFormModal from '../components/inventory/InventoryFormModal'
import { getInventoryStatus } from '../data/inventoryMock'
import '../styles/inventory/inventory.css'

const availabilityFilters = ['Todos', 'Disponibles', 'Stock bajo', 'Agotados']
const PRODUCTS_PER_PAGE = 5

function normalizeText(value) {
  return String(value ?? '').trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function Inventory() {
  const {
    items: products,
    loading,
    error,
    addItem,
    updateItem,
    refreshInventory // <-- Extraemos la función de recarga
  } = useInventory()

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [demoMessage, setDemoMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  
  const fileInputRef = useRef(null) // <-- Referencia al input oculto

  const categories = useMemo(() => {
    return ['Todas', ...new Set(products.map((product) => product.categoryName).filter(Boolean))]
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(search)
    return products.filter((product) => {
      const searchableText = normalizeText([product.name, product.code, product.categoryName, product.brandName].filter(Boolean).join(' '))
      const matchesSearch = searchableText.includes(normalizedSearch)
      const status = getInventoryStatus(product)
      const matchesAvailability = activeFilter === 'Todos' || (activeFilter === 'Disponibles' && status.type === 'available') || (activeFilter === 'Stock bajo' && status.type === 'low') || (activeFilter === 'Agotados' && status.type === 'out')
      const matchesCategory = selectedCategory === 'Todas' || product.categoryName === selectedCategory
      return matchesSearch && matchesAvailability && matchesCategory
    })
  }, [products, search, activeFilter, selectedCategory])

  const totalFilteredProducts = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalFilteredProducts / PRODUCTS_PER_PAGE))
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages)
  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const visibleProducts = filteredProducts.slice(startIndex, endIndex)
  const firstVisibleProduct = totalFilteredProducts === 0 ? 0 : startIndex + 1
  const lastVisibleProduct = Math.min(endIndex, totalFilteredProducts)
  const totalProducts = products.length
  const lowStockProducts = products.filter((product) => getInventoryStatus(product).type === 'low').length
  const outOfStockProducts = products.filter((product) => getInventoryStatus(product).type === 'out').length
  const expiringProducts = null

  const stats = [
    { label: 'Total de productos', value: totalProducts, description: 'Productos registrados', icon: Package, type: 'primary' },
    { label: 'Stock bajo', value: lowStockProducts, description: 'Requieren reabastecimiento', icon: AlertTriangle, type: 'warning' },
    { label: 'Productos agotados', value: outOfStockProducts, description: 'Sin existencias disponibles', icon: PackageX, type: 'danger' },
    { label: 'Próximos a vencer', value: expiringProducts ?? '—', description: 'Pendiente de datos de vencimiento', icon: CalendarClock, type: 'info' }
  ]

  const handleSearch = (event) => { setSearch(event.target.value); setCurrentPage(1) }
  const handleAvailabilityFilter = (filter) => { setActiveFilter(filter); setCurrentPage(1) }
  const handleCategoryFilter = (event) => { setSelectedCategory(event.target.value); setCurrentPage(1) }
  const clearFilters = () => { setSearch(''); setActiveFilter('Todos'); setSelectedCategory('Todas'); setCurrentPage(1) }
  const hasActiveFilters = search.trim() !== '' || activeFilter !== 'Todos' || selectedCategory !== 'Todas'

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1))
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1))

  const handleViewProduct = (product) => setSelectedProduct(product)
  const closeDetailsModal = () => setSelectedProduct(null)
  const openCreateModal = () => { setEditingProduct(null); setIsFormOpen(true) }
  const handleEditProduct = (product) => { setSelectedProduct(null); setEditingProduct(product); setIsFormOpen(true) }
  const closeFormModal = () => { setIsFormOpen(false); setEditingProduct(null) }

  // ==========================================
  // CARGA MASIVA DE EXCEL
  // ==========================================
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    setIsUploading(true)

    try {
      // Importante: Asegúrate de que esta URL coincida con tu backend
      const response = await fetch('http://localhost:3000/api/inventory/import', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()
      
      if (result.errors?.length > 0) {
        console.warn('Errores de importación:', result.errors)
        alert(`Se importaron ${result.success} productos. Hubo ${result.errors.length} errores. Revisa la consola para más detalles.`)
      } else {
        setDemoMessage(`¡Se importaron ${result.success} productos exitosamente!`)
      }
      if (refreshInventory) refreshInventory()
    } catch (error) {
      alert('Error de red al subir el archivo Excel.')
    } finally {
      setIsUploading(false)
      event.target.value = null
    }
  }

  const handleSubmitProduct = async (productData) => {
    try {
      if (editingProduct) {
        await updateItem(editingProduct.id, {
          code: productData.code, name: productData.name, categoryId: productData.categoryId, brandId: productData.brandId, unitId: productData.unitId, stock: productData.stock, minStock: productData.minStock, unitPrice: productData.unitPrice
        })
        setDemoMessage('Producto actualizado correctamente en la base de datos.')
      } else {
        await addItem({
          code: productData.code, name: productData.name, categoryId: productData.categoryId, brandId: productData.brandId, unitId: productData.unitId, stock: productData.stock || 0, minStock: productData.minStock, unitPrice: productData.unitPrice
        })
        setDemoMessage('Producto registrado correctamente en la base de datos.')
      }
      setSearch(''); setActiveFilter('Todos'); setSelectedCategory('Todas'); setCurrentPage(1); closeFormModal()
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    }
  }

  if (loading) return <div className="inventory-page"><div style={{ padding: '3rem', textAlign: 'center' }}><p>Cargando inventario desde Supabase...</p></div></div>
  if (error) return <div className="inventory-page"><div style={{ padding: '3rem', textAlign: 'center', color: '#dc2626' }}><p>Error al cargar inventario: {error}</p></div></div>

  return (
    <div className="inventory-page">
      <section className="inventory-heading">
        <div>
          <span className="dashboard-section-eyebrow">GESTIÓN DE INVENTARIO</span>
          <h2>Control de inventario</h2>
          <p>Administra los productos dermatológicos, insumos médicos y materiales de la clínica.</p>
        </div>
        
        {/* GRUPO DE BOTONES */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
          />
          <button 
            type="button" 
            className="dashboard-secondary-button" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
          >
            <Upload size={18} strokeWidth={1.8} />
            <span>{isUploading ? 'Subiendo...' : 'Importar Excel'}</span>
          </button>
          
          <button type="button" className="dashboard-primary-button" onClick={openCreateModal}>
            <Plus size={18} strokeWidth={1.8} />
            <span>Nuevo producto</span>
          </button>
        </div>
      </section>

      {demoMessage && (
        <div className="inventory-demo-message" role="status">
          <span>{demoMessage}</span>
          <button type="button" onClick={() => setDemoMessage('')}><X size={16} /></button>
        </div>
      )}

      <section className="inventory-stats">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <article key={stat.label} className={`inventory-stat-card ${stat.type}`}>
              <div className="inventory-stat-icon"><Icon size={22} strokeWidth={1.8} /></div>
              <div className="inventory-stat-info">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.description}</small>
              </div>
            </article>
          )
        })}
      </section>

      <section className="inventory-catalog">
        <div className="inventory-catalog-header">
          <div>
            <span className="dashboard-panel-eyebrow">CATÁLOGO</span>
            <h3>Productos e insumos</h3>
            <p>Consulta y administra los productos registrados en el inventario.</p>
          </div>
          <span className="inventory-total-badge">{totalProducts} {totalProducts === 1 ? 'producto' : 'productos'}</span>
        </div>

        <div className="inventory-toolbar">
          <div className="inventory-search">
            <Search size={18} strokeWidth={1.8} />
            <input type="search" placeholder="Buscar por nombre, código, categoría o marca..." value={search} onChange={handleSearch} />
            {search && <button type="button" className="inventory-search-clear" onClick={() => { setSearch(''); setCurrentPage(1) }}><X size={16} /></button>}
          </div>

          <div className="inventory-filter-group">
            <div className="inventory-filter-label"><SlidersHorizontal size={17} strokeWidth={1.8} /><span>Filtrar:</span></div>
            <div className="inventory-filters">
              {availabilityFilters.map((filter) => (
                <button key={filter} type="button" className={`inventory-filter ${activeFilter === filter ? 'active' : ''}`} onClick={() => handleAvailabilityFilter(filter)}>{filter}</button>
              ))}
            </div>
          </div>

          <div className="inventory-category-filter">
            <label htmlFor="inventory-category">Categoría</label>
            <select id="inventory-category" value={selectedCategory} onChange={handleCategoryFilter}>
              {categories.map((category) => (
                <option key={category} value={category}>{category === 'Todas' ? 'Todas las categorías' : category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="inventory-results">
          <span>Mostrando <strong>{totalFilteredProducts}</strong> de <strong>{totalProducts}</strong> {totalProducts === 1 ? 'producto' : 'productos'}</span>
          {hasActiveFilters && <button type="button" className="inventory-clear-filters" onClick={clearFilters}><X size={15} /> Limpiar filtros</button>}
        </div>

        <InventoryTable products={visibleProducts} onView={handleViewProduct} onEdit={handleEditProduct} />

        <div className="inventory-pagination">
          <p>Mostrando <strong>{firstVisibleProduct}-{lastVisibleProduct}</strong> de <strong>{totalFilteredProducts}</strong> {totalFilteredProducts === 1 ? 'producto' : 'productos'}</p>
          <div className="inventory-pagination-actions">
            <button type="button" disabled={safeCurrentPage === 1} onClick={goToPreviousPage}><ChevronLeft size={17} /></button>
            <span>Página {safeCurrentPage} de {totalPages}</span>
            <button type="button" disabled={safeCurrentPage === totalPages} onClick={goToNextPage}><ChevronRight size={17} /></button>
          </div>
        </div>
      </section>

      <InventoryDetailsModal product={selectedProduct} onClose={closeDetailsModal} />
      <InventoryFormModal isOpen={isFormOpen} product={editingProduct} onClose={closeFormModal} onSubmit={handleSubmitProduct} />
    </div>
  )
}

export default Inventory