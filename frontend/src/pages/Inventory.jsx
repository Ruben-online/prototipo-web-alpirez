import { useMemo, useState } from 'react'

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
  inventoryMock,
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
  // PRODUCTOS DE DEMOSTRACIÓN
  // ==========================================

  // Estado temporal exclusivo del frontend.
  // No se conecta a Supabase ni a localStorage.

  const [products, setProducts] = useState(
    () => inventoryMock.map((product) => ({ ...product }))
  )

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
          .map((product) => product.category)
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
        product.category,
        product.brand,
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
        product.category === selectedCategory

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

  // Pendiente de información real de vencimientos.
  const expiringProducts = null

  const stats = [
    {
      label: 'Total de productos',
      value: totalProducts,
      description: 'Productos de demostración',
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
  // BÚSQUEDA Y FILTROS
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
  // MODAL DE DETALLES
  // ==========================================

  const handleViewProduct = (product) => {
    setSelectedProduct(product)
  }

  const closeDetailsModal = () => {
    setSelectedProduct(null)
  }

  // ==========================================
  // MODAL DE REGISTRO
  // ==========================================

  const openCreateModal = () => {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  // ==========================================
  // MODAL DE EDICIÓN
  // ==========================================

  const handleEditProduct = (product) => {
    setSelectedProduct(null)
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  // ==========================================
  // CERRAR FORMULARIO
  // ==========================================

  const closeFormModal = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  // ==========================================
  // SIMULACIÓN LOCAL DE REGISTRO Y EDICIÓN
  // ==========================================

  const handleSubmitProduct = async (productData) => {

    // Evitamos códigos duplicados durante la demostración.

    const duplicateCode = products.some(
      (product) =>
        normalizeText(product.code) ===
          normalizeText(productData.code) &&
        product.id !== editingProduct?.id
    )

    if (duplicateCode) {
      throw new Error(
        'Ya existe un producto con ese código.'
      )
    }

    if (editingProduct) {

      // EDICIÓN TEMPORAL

      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...productData }
            : product
        )
      )

      setDemoMessage(
        'Cambios aplicados únicamente en esta demostración. No se guardaron en la base de datos.'
      )

    } else {

      // REGISTRO TEMPORAL

      const newProduct = {
        ...productData,
        id: crypto.randomUUID(),

        // Las existencias reales serán administradas
        // por el backend.
        stock: 0,
      }

      setProducts((previous) => [
        newProduct,
        ...previous,
      ])

      setDemoMessage(
        'Producto agregado únicamente a la demostración. No se guardó en la base de datos.'
      )

    }

    // Restablecer filtros para visualizar los cambios.

    setSearch('')
    setActiveFilter('Todos')
    setSelectedCategory('Todas')
    setCurrentPage(1)

    closeFormModal()
  }

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <div className="inventory-page">

      {/* ==========================================
          ENCABEZADO
      ========================================== */}

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

      {/* ==========================================
          MENSAJE DE DEMOSTRACIÓN
      ========================================== */}

      {demoMessage && (
        <div
          className="inventory-demo-message"
          role="status"
        >
          <span>{demoMessage}</span>

          <button
            type="button"
            aria-label="Cerrar mensaje"
            onClick={() => setDemoMessage('')}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ==========================================
          ESTADÍSTICAS
      ========================================== */}

      <section className="inventory-stats">

        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <article
              key={stat.label}
              className={`inventory-stat-card ${stat.type}`}
            >

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

      {/* ==========================================
          CATÁLOGO DE PRODUCTOS
      ========================================== */}

      <section className="inventory-catalog">

        <div className="inventory-catalog-header">

          <div>
            <span className="dashboard-panel-eyebrow">
              CATÁLOGO
            </span>

            <h3>Productos e insumos</h3>

            <p>
              Consulta y administra los productos
              registrados en el inventario.
            </p>
          </div>

          <span className="inventory-total-badge">
            {totalProducts}{' '}
            {totalProducts === 1 ? 'producto' : 'productos'}
          </span>

        </div>

        {/* ==========================================
            BUSCADOR Y FILTROS
        ========================================== */}

        <div className="inventory-toolbar">

          <div className="inventory-search">

            <Search size={18} strokeWidth={1.8} />

            <input
              type="search"
              placeholder="Buscar por nombre, código, categoría o marca..."
              aria-label="Buscar productos"
              value={search}
              onChange={handleSearch}
            />

            {search && (
              <button
                type="button"
                className="inventory-search-clear"
                aria-label="Limpiar búsqueda"
                onClick={() => {
                  setSearch('')
                  setCurrentPage(1)
                }}
              >
                <X size={16} />
              </button>
            )}

          </div>

          {/* FILTROS POR DISPONIBILIDAD */}

          <div className="inventory-filter-group">

            <div className="inventory-filter-label">

              <SlidersHorizontal
                size={17}
                strokeWidth={1.8}
              />

              <span>Filtrar:</span>

            </div>

            <div className="inventory-filters">

              {availabilityFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`inventory-filter ${
                    activeFilter === filter ? 'active' : ''
                  }`}
                  aria-pressed={activeFilter === filter}
                  onClick={() =>
                    handleAvailabilityFilter(filter)
                  }
                >
                  {filter}
                </button>
              ))}

            </div>

          </div>

          {/* FILTRO POR CATEGORÍA */}

          <div className="inventory-category-filter">

            <label htmlFor="inventory-category">
              Categoría
            </label>

            <select
              id="inventory-category"
              value={selectedCategory}
              onChange={handleCategoryFilter}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category === 'Todas'
                    ? 'Todas las categorías'
                    : category}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* ==========================================
            RESULTADOS
        ========================================== */}

        <div className="inventory-results">

          <span>
            Mostrando{' '}
            <strong>{totalFilteredProducts}</strong>{' '}
            de <strong>{totalProducts}</strong>{' '}
            {totalProducts === 1
              ? 'producto'
              : 'productos'}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              className="inventory-clear-filters"
              onClick={clearFilters}
            >
              <X size={15} />
              Limpiar filtros
            </button>
          )}

        </div>

        {/* ==========================================
            TABLA DE PRODUCTOS
        ========================================== */}

        <InventoryTable
          products={visibleProducts}
          onView={handleViewProduct}
          onEdit={handleEditProduct}
        />

        {/* ==========================================
            PAGINACIÓN
        ========================================== */}

        <div className="inventory-pagination">

          <p>
            Mostrando{' '}
            <strong>
              {firstVisibleProduct}-{lastVisibleProduct}
            </strong>{' '}
            de <strong>{totalFilteredProducts}</strong>{' '}
            {totalFilteredProducts === 1
              ? 'producto'
              : 'productos'}
          </p>

          <div className="inventory-pagination-actions">

            <button
              type="button"
              aria-label="Página anterior"
              disabled={safeCurrentPage === 1}
              onClick={goToPreviousPage}
            >
              <ChevronLeft size={17} />
            </button>

            <span>
              Página {safeCurrentPage} de {totalPages}
            </span>

            <button
              type="button"
              aria-label="Página siguiente"
              disabled={safeCurrentPage === totalPages}
              onClick={goToNextPage}
            >
              <ChevronRight size={17} />
            </button>

          </div>

        </div>

      </section>

      {/* ==========================================
          MODAL DE DETALLES
      ========================================== */}

      <InventoryDetailsModal
        product={selectedProduct}
        onClose={closeDetailsModal}
      />

      {/* ==========================================
          MODAL DE REGISTRO Y EDICIÓN
      ========================================== */}

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