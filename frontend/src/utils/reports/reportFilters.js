import { getInventoryStatus } from '../../data/inventoryMock'

// ==========================================
// REPORTS - INVENTORY REPORT TYPES
// ==========================================

export const inventoryReportTypes = [
  {
    id: 'general',
    label: 'Inventario general',
    description: 'Todos los productos registrados.',
  },
  {
    id: 'low',
    label: 'Productos con stock bajo',
    description: 'Productos que requieren reabastecimiento.',
  },
  {
    id: 'out',
    label: 'Productos agotados',
    description: 'Productos sin existencias disponibles.',
  },
  {
    id: 'expiration',
    label: 'Control de vencimientos',
    description: 'Pendiente de información de vencimientos.',
    disabled: true,
  },
]

// ==========================================
// REPORTS - NORMALIZE TEXT
// ==========================================

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// ==========================================
// REPORTS - INVENTORY FILTERS
// ==========================================

export function filterInventoryReport(
  products = [],
  {
    reportType = 'general',
    category = 'Todas',
    search = '',
  } = {}
) {
  const selectedReport = inventoryReportTypes.find(
    (type) => type.id === reportType && !type.disabled
  )

  // No mostramos resultados para reportes
  // desconocidos o todavía no habilitados.
  if (!selectedReport) {
    return []
  }

  const normalizedSearch = normalizeText(search)

  return products.filter((product) => {
    const status = getInventoryStatus(product)

    const matchesReportType =
      reportType === 'general' ||
      (reportType === 'low' && status.type === 'low') ||
      (reportType === 'out' && status.type === 'out')

    const matchesCategory =
      category === 'Todas' ||
      product.category === category

    const searchableText = normalizeText([
      product.name,
      product.code,
      product.category,
      product.brand,
    ].filter(Boolean).join(' '))

    const matchesSearch =
      searchableText.includes(normalizedSearch)

    return (
      matchesReportType &&
      matchesCategory &&
      matchesSearch
    )
  })
}