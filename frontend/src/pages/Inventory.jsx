import { useMemo, useState, useEffect } from 'react'
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
} from 'lucide-react'

import InventoryTable from '../components/inventory/InventoryTable'
import InventoryDetailsModal from '../components/inventory/InventoryDetailsModal'
import InventoryFormModal from '../components/inventory/InventoryFormModal'

import {
  getInventoryStatus,
} from '../data/inventoryMock'

import '../styles/inventory/inventory.css'

// ==========================================
// CONSTANTES
// ==========================================

const availabilityFilters = [
  'Todos',
  'Disponibles',
  'Stock bajo',
  'Agotados',
]

const PRODUCTS_PER_PAGE = 5

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function Inventory() {

  // ==========================================
  // DATOS DE SUPABASE
  // ==========================================

  const {
    items: products,
    loading,
    error,
    addItem,
    updateItem,
  } = useInventory()


  // ==========================================
  // ESTADOS DE LA INTERFAZ
  // ==========================================

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [selectedCategory, setSelectedCategory] = useState('Todas')

  // Modal de detalles
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Modal de registro y edición
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Mensaje informativo de demostración
  const [demoMessage, setDemoMessage] = useState('')

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)

  // ==========================================
  // CATEGORÍAS DISPONIBLES
  // ==========================================

  const categories = useMemo(() => {
    return [
      'Todas',
      ...new Set(
        products
          .map((product) => product.categoryName) // <-- Ajustado para usar la propiedad real
          .filter(Boolean)
      ),
    ]
  }, [products])

  // ==========================================
  // BÚSQUEDA Y FILTROS
  // ==========================================

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(search)

    return products.filter((product) => {

      const searchableText = normalizeText([
        product.name,
        product.code,
        product.categoryName, // <-- Ajustado
        product.brandName,    // <-- Ajustado
      ].filter(Boolean).join(' '))

      const matchesSearch =
        searchableText.includes(normalizedSearch)

      const status = getInventoryStatus(product)

      const matchesAvailability =
        activeFilter === 'Todos' ||
        (
          activeFilter === 'Disponibles' &&
          status.type === 'available'
        ) ||
        (
          activeFilter === 'Stock bajo' &&
          status.type === 'low'
        ) ||
        (
          activeFilter === 'Agotados' &&
          status.type === 'out'
        )

      const matchesCategory =
        selectedCategory === 'Todas' ||
        product.categoryName === selectedCategory // <-- Ajustado

      return (
        matchesSearch &&
        matchesAvailability &&
        matchesCategory
      )
    })
  }, [
    products,
    search,
    activeFilter,
    selectedCategory,
  ])

  // ==========================================
  // PAGINACIÓN
  // ==========================================

  const totalFilteredProducts = filteredProducts.length

  const totalPages = Math.max(
    1,
    Math.ceil(totalFilteredProducts / PRODUCTS_PER_PAGE)
  )

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages
  )

  const startIndex =
    (safeCurrentPage - 1) * PRODUCTS_PER_PAGE

  const endIndex = startIndex + PRODUCTS_PER_PAGE

  const visibleProducts = filteredProducts.slice(
    startIndex,
    endIndex
  )

  const firstVisibleProduct =
    totalFilteredProducts === 0
      ? 0
      : startIndex + 1

  const lastVisibleProduct = Math.min(
    endIndex,
    totalFilteredProducts
  )

  // ==========================================
  // ESTADÍSTICAS GENERALES
  // ==========================================

  const totalProducts = products.length

  const lowStockProducts = products.filter(
    (product) =>
      getInventoryStatus(product).type === 'low'
  ).length

  const outOfStockProducts = products.filter(
    (product) =>
      getInventoryStatus(product).type === 'out'
  ).length

  const expiringProducts = null

  const stats = [
    {
      label: 'Total de productos',
      value: totalProducts,
      description: 'Productos registrados',
      icon: Package,
      type: 'primary',
    },
    {
      label: 'Stock bajo',
      value: lowStockProducts,
      description: 'Requieren reabastecimiento',
      icon: AlertTriangle,
      type: 'warning',
    },
    {
      label: 'Productos agotados',
      value: outOfStockProducts,
      description: 'Sin existencias disponibles',
      icon: PackageX,
      type: 'danger',
    },
    {
      label: 'Próximos a vencer',
      value: expiringProducts ?? '—',
      description: 'Pendiente de datos de vencimiento',
      icon: CalendarClock,
      type: 'info',
    },
  ]

  // ==========================================
  // BÚSQUEDA Y FILTROS EVENTOS
  // ==========================================

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setCurrentPage(1)
  }

  const handleAvailabilityFilter = (filter) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  const handleCategoryFilter = (event) => {
    setSelectedCategory(event.target.value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setActiveFilter('Todos')
    setSelectedCategory('Todas')
    setCurrentPage(1)
  }

  const hasActiveFilters =
    search.trim() !== '' ||
    activeFilter !== 'Todos' ||
    selectedCategory !== 'Todas'

  // ==========================================
  // NAVEGACIÓN ENTRE PÁGINAS
  // ==========================================

  const goToPreviousPage = () => {
    setCurrentPage((previous) =>
      Math.max(1, previous - 1)
    )
  }

  const goToNextPage = () => {
    setCurrentPage((previous) =>
      Math.min(totalPages, previous + 1)
    )
  }

  // ==========================================
  // MODALES
  // ==========================================

  const handleViewProduct = (product) => {
    setSelectedProduct(product)
  }

  const closeDetailsModal = () => {
    setSelectedProduct(null)
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(null)
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const closeFormModal = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  // ==========================================
  // 🔥 SOLUCIÓN: ENVÍO REAL A LA BASE DE DATOS
  // ==========================================

  const handleSubmitProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Enviar con los nombres exactos que el Contexto espera
        await updateItem(editingProduct.id, {
          code: productData.code,
          name: productData.name,
          categoryId: productData.categoryId,
          brandId: productData.brandId,
          unitId: productData.unitId,
          stock: productData.stock,
          minStock: productData.minStock,
          unitPrice: productData.unitPrice // <-- Antes pasabas `productData.price`
        })
        setDemoMessage('Producto actualizado correctamente en la base de datos.')
      } else {
        await addItem({
          code: productData.code,
          name: productData.name,
          categoryId: productData.categoryId,
          brandId: productData.brandId,
          unitId: productData.unitId,
          stock: productData.stock || 0,
          minStock: productData.minStock,
          unitPrice: productData.unitPrice // <-- Antes pasabas `productData.price`
        })
        setDemoMessage('Producto registrado correctamente en la base de datos.')
      }

      setSearch('')
      setActiveFilter('Todos')
      setSelectedCategory('Todas')
      setCurrentPage(1)
      closeFormModal()
    } catch (err) {
      console.error('Error saving product:', err)
      alert('Error al guardar: ' + err.message)
    }
  }


  // ==========================================
  // INTERFAZ
  // ==========================================

  if (loading) {
    return (
      <div className="inventory-page">
        <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
          <p>Cargando inventario desde Supabase...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="inventory-page">
        <div style={{ padding: '3rem', textAlign: 'center', color: '#dc2626' }}>
          <p>Error al cargar inventario: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="inventory-page">

      {/* ENCABEZADO */}
      <section className="inventory-heading">
        <div>
          <span className="dashboard-section-eyebrow">
            GESTIÓN DE INVENTARIO
          </span>
          <h2>Control de inventario</h2>
          <p>
            Administra los productos dermatológicos,
            insumos médicos y materiales de la clínica.
          </p>
        </div>
        <button
          type="button"
          className="dashboard-primary-button"
          onClick={openCreateModal}
        >
          <Plus size={18} strokeWidth={1.8} />
          <span>Nuevo producto</span>
        </button>
      </section>

      {/* MENSAJE DE ÉXITO */}
      {demoMessage && (
        <div className="inventory-demo-message" role="status">
          <span>{demoMessage}</span>
          <button type="button" aria-label="Cerrar mensaje" onClick={() => setDemoMessage('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* ESTADÍSTICAS */}
      <section className="inventory-stats">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <article key={stat.label} className={`inventory-stat-card ${stat.type}`}>
              <div className="inventory-stat-icon">
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <div className="inventory-stat-info">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.description}</small>
              </div>
            </article>
          )
        })}
      </section>

      {/* CATÁLOGO DE PRODUCTOS */}
      <section className="inventory-catalog">
        <div className="inventory-catalog-header">
          <div>
            <span className="dashboard-panel-eyebrow">CATÁLOGO</span>
            <h3>Productos e insumos</h3>
            <p>Consulta y administra los productos registrados en el inventario.</p>
          </div>
          <span className="inventory-total-badge">
            {totalProducts} {totalProducts === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {/* BUSCADOR Y FILTROS */}
        <div className="inventory-toolbar">
          <div className="inventory-search">
            <Search size={18} strokeWidth={1.8} />
            <input
              type="search"
              placeholder="Buscar por nombre, código, categoría o marca..."
              value={search}
              onChange={handleSearch}
            />
            {search && (
              <button type="button" className="inventory-search-clear" onClick={() => { setSearch(''); setCurrentPage(1) }}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="inventory-filter-group">
            <div className="inventory-filter-label">
              <SlidersHorizontal size={17} strokeWidth={1.8} />
              <span>Filtrar:</span>
            </div>
            <div className="inventory-filters">
              {availabilityFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`inventory-filter ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => handleAvailabilityFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="inventory-category-filter">
            <label htmlFor="inventory-category">Categoría</label>
            <select id="inventory-category" value={selectedCategory} onChange={handleCategoryFilter}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'Todas' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="inventory-results">
          <span>
            Mostrando <strong>{totalFilteredProducts}</strong> de <strong>{totalProducts}</strong> {totalProducts === 1 ? 'producto' : 'productos'}
          </span>
          {hasActiveFilters && (
            <button type="button" className="inventory-clear-filters" onClick={clearFilters}>
              <X size={15} /> Limpiar filtros
            </button>
          )}
        </div>

        {/* TABLA DE PRODUCTOS */}
        <InventoryTable
          products={visibleProducts}
          onView={handleViewProduct}
          onEdit={handleEditProduct}
        />

        {/* PAGINACIÓN */}
        <div className="inventory-pagination">
          <p>
            Mostrando <strong>{firstVisibleProduct}-{lastVisibleProduct}</strong> de <strong>{totalFilteredProducts}</strong> {totalFilteredProducts === 1 ? 'producto' : 'productos'}
          </p>
          <div className="inventory-pagination-actions">
            <button type="button" disabled={safeCurrentPage === 1} onClick={goToPreviousPage}>
              <ChevronLeft size={17} />
            </button>
            <span>Página {safeCurrentPage} de {totalPages}</span>
            <button type="button" disabled={safeCurrentPage === totalPages} onClick={goToNextPage}>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* MODALES */}
      <InventoryDetailsModal
        product={selectedProduct}
        onClose={closeDetailsModal}
      />

      <InventoryFormModal
        isOpen={isFormOpen}
        product={editingProduct}
        onClose={closeFormModal}
        onSubmit={handleSubmitProduct}
      />

    </div>
  )
}

export default Inventory