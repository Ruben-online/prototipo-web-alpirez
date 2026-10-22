import {
  useEffect,
  useState,
  useCallback,
} from 'react'

import { AppointmentsContext } from './appointmentsContext'
import { supabase } from '../supabase'

// ==========================================
// CONFIGURACIÓN
// ==========================================

const APPOINTMENT_STATUSES = [
  'Confirmada',
  'Completada',
  'Cancelada',
  'No asistió',
]

// ==========================================
// FUNCIONES DE MAPEÓ (DB <-> Frontend)
// ==========================================

const mapAppointmentFromDB = (a) => ({
  id: a.id,
  patientId: a.patient_id,
  date: a.appointment_date,
  time: a.start_time.substring(0, 5), // 'HH:mm:ss' -> 'HH:mm'
  duration: a.duration_minutes,
  service: a.service,
  status: a.status,
  notes: a.notes,
  patient: a.patients ? {
    name: a.patients.full_name,
    phone: a.patients.phone
  } : null
})

// ==========================================
// PROVIDER
// ==========================================

export function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  // ========================================
  // CARGAR CITAS DESDE SUPABASE
  // ========================================

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients(full_name, phone)
        `)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error
      setAppointments(data.map(mapAppointmentFromDB))
    } catch (err) {
      console.error('Error fetching appointments:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  // ========================================
  // OBTENER CITA POR ID
  // ========================================

  const getAppointmentById = (id) => {
    return appointments.find(a => String(a.id) === String(id))
  }

  // ========================================
  // OBTENER CITAS DE UN PACIENTE
  // ========================================

  const getPatientAppointments = (patientId) => {
    return appointments
      .filter(a => String(a.patientId) === String(patientId))
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
  }

  // ========================================
  // OBTENER CITAS DE UNA FECHA
  // ========================================

  const getAppointmentsByDate = (date) => {
    return appointments
      .filter(a => a.date === date)
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  // ========================================
  // CREAR CITA
  // ========================================

  const addAppointment = async (appointmentData) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: appointmentData.patientId,
          appointment_date: appointmentData.date,
          start_time: appointmentData.time,
          duration_minutes: Number(appointmentData.duration),
          service: appointmentData.service,
          status: 'Confirmada',
          notes: appointmentData.notes || ''
        }])
        .select()

      if (error) throw error
      await fetchAppointments()
      return { success: true, appointment: data[0] }
    } catch (err) {
      console.error('Error adding appointment:', err)
      return { success: false, message: err.message }
    }
  }

  // ========================================
  // EDITAR O REPROGRAMAR CITA
  // ========================================

  const updateAppointment = async (appointmentId, updatedData) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          appointment_date: updatedData.date,
          start_time: updatedData.time,
          duration_minutes: Number(updatedData.duration),
          service: updatedData.service,
          status: updatedData.status,
          notes: updatedData.notes
        })
        .eq('id', appointmentId)

      if (error) throw error
      await fetchAppointments()
      return { success: true }
    } catch (err) {
      console.error('Error updating appointment:', err)
      return { success: false, message: err.message }
    }
  }

  // ========================================
  // CAMBIAR ESTADO DE CITA
  // ========================================

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId)

      if (error) throw error
      await fetchAppointments()
      return { success: true }
    } catch (err) {
      console.error('Error updating status:', err)
      return { success: false, message: err.message }
    }
  }

  const cancelAppointment = (appointmentId) => {
    return updateAppointmentStatus(appointmentId, 'Cancelada')
  }

  // ========================================
  // CONSULTAR DISPONIBILIDAD (Aprox localmente)
  // ========================================

  const isTimeAvailable = (date, time, duration, excludeId = null) => {
    const newStart = time
    const newEndMinutes = (t) => {
      const [h, m] = t.split(':').map(Number)
      return h * 60 + m
    }
    const startM = newEndMinutes(time)
    const endM = startM + Number(duration)

    return !appointments.some(a => {
      if (a.date !== date) return false
      if (excludeId && String(a.id) === String(excludeId)) return false
      if (['Cancelada', 'No asistió'].includes(a.status)) return false

      const aStartM = newEndMinutes(a.time)
      const aEndM = aStartM + a.duration
      return (startM < aEndM && endM > aStartM)
    })
  }

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        loading,
        getAppointmentById,
        getPatientAppointments,
        getAppointmentsByDate,
        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        isTimeAvailable,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  )
}