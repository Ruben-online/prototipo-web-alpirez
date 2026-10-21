import { useContext } from 'react'
import { PatientsContext } from '../context/patientsContext'

// ==========================================
// HOOK PERSONALIZADO
// ==========================================

export function usePatients() {
  const context = useContext(PatientsContext)

  if (!context) {
    throw new Error(
      'usePatients debe utilizarse dentro de PatientsProvider'
    )
  }

  return context
}