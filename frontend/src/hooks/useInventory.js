import { useContext } from 'react'
import { InventoryContext } from '../context/inventoryContext'

export function useInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory debe usarse dentro de un InventoryProvider')
  }
  return context
}
