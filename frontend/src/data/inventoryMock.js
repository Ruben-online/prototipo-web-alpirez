// ==========================================
// INVENTORY - DATOS DE DEMOSTRACIÓN
// ==========================================

// Estos productos son ficticios.
// Serán reemplazados por información real
// cuando se integre el backend.

export const inventoryMock = [
  {
    id: 1,
    code: 'PROD-001',
    name: 'Protector solar facial SPF 50',
    category: 'Dermatológicos',
    brand: 'La Roche-Posay',
    stock: 25,
    minStock: 5,
    unit: 'Unidad',
    price: 185,
  },
  {
    id: 2,
    code: 'INS-001',
    name: 'Guantes médicos de nitrilo',
    category: 'Insumos médicos',
    brand: 'Genérico',
    stock: 8,
    minStock: 20,
    unit: 'Caja',
    price: 95,
  },
  {
    id: 3,
    code: 'INS-002',
    name: 'Gasas estériles',
    category: 'Insumos médicos',
    brand: 'Genérico',
    stock: 0,
    minStock: 10,
    unit: 'Paquete',
    price: 35,
  },
  {
    id: 4,
    code: 'PROD-002',
    name: 'Limpiador facial hidratante',
    category: 'Dermatológicos',
    brand: 'CeraVe',
    stock: 18,
    minStock: 5,
    unit: 'Unidad',
    price: 145,
  },
  {
    id: 5,
    code: 'TRAT-001',
    name: 'Solución para peeling químico',
    category: 'Productos para procedimientos',
    brand: 'Genérico',
    stock: 4,
    minStock: 8,
    unit: 'Frasco',
    price: 250,
  },
  {
    id: 6,
    code: 'INS-003',
    name: 'Jeringas desechables',
    category: 'Insumos médicos',
    brand: 'Genérico',
    stock: 50,
    minStock: 20,
    unit: 'Unidad',
    price: 3.5,
  },
]

// ==========================================
// ESTADO DE EXISTENCIAS
// ==========================================

export function getInventoryStatus(product) {
  if (product.stock <= 0) {
    return {
      label: 'Agotado',
      type: 'out',
    }
  }

  if (product.stock <= product.minStock) {
    return {
      label: 'Stock bajo',
      type: 'low',
    }
  }

  return {
    label: 'Disponible',
    type: 'available',
  }
}