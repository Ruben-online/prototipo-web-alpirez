import { useContext } from 'react'
import { AppointmentsContext } from '../context/appointmentsContext'

// ==========================================
// HOOK PERSONALIZADO
// ==========================================

export function useAppointments() {
  const context = useContext(AppointmentsContext)

  if (!context) {
    throw new Error(
      'useAppointments debe utilizarse dentro de AppointmentsProvider'
    )
  }

  return context
}