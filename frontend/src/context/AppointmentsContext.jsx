import {
  useEffect,
  useState,
} from 'react'

import { AppointmentsContext } from './appointmentsContext'

// ==========================================
// CONFIGURACIÓN
// ==========================================

const STORAGE_KEY = 'alpirez_appointments'

const APPOINTMENT_STATUSES = [
  'Confirmada',
  'Completada',
  'Cancelada',
  'No asistió',
]

// Estados que ocupan un horario.

const BLOCKING_STATUSES = [
  'Confirmada',
  'Completada',
]

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

// Convierte una fecha a YYYY-MM-DD.

function formatDateKey(date) {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    date.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// Suma días a una fecha.

function addDays(date, amount) {
  const result = new Date(date)

  result.setDate(
    result.getDate() + amount
  )

  return result
}

// Compara identificadores numéricos y UUID.

function isSameId(first, second) {
  return String(first) === String(second)
}

// Convierte HH:mm a minutos.

function timeToMinutes(time) {
  const [hours, minutes] = time
    .split(':')
    .map(Number)

  return hours * 60 + minutes
}

// Comprueba que una fecha sea válida.

function isValidDate(dateString) {
  if (
    typeof dateString !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    return false
  }

  const [year, month, day] = dateString
    .split('-')
    .map(Number)

  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

// Comprueba que una hora sea válida.

function isValidTime(time) {
  if (
    typeof time !== 'string' ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  ) {
    return false
  }

  return true
}

// ==========================================
// CITAS FICTICIAS
// ==========================================

const today = new Date()

const todayKey = formatDateKey(today)

const tomorrowKey = formatDateKey(
  addDays(today, 1)
)

const initialAppointments = [
  {
    id: 1,
    patientId: 1,
    date: todayKey,
    time: '09:00',
    duration: 30,
    service: 'Consulta dermatológica',
    status: 'Confirmada',
    notes: '',
  },
  {
    id: 2,
    patientId: 2,
    date: todayKey,
    time: '10:00',
    duration: 45,
    service: 'Control de dermatitis',
    status: 'Confirmada',
    notes: '',
  },
  {
    id: 3,
    patientId: 3,
    date: todayKey,
    time: '11:30',
    duration: 30,
    service: 'Evaluación de manchas',
    status: 'Confirmada',
    notes: '',
  },
  {
    id: 4,
    patientId: 5,
    date: tomorrowKey,
    time: '09:30',
    duration: 30,
    service: 'Consulta dermatológica',
    status: 'Confirmada',
    notes: '',
  },
  {
    id: 5,
    patientId: 6,
    date: tomorrowKey,
    time: '11:00',
    duration: 45,
    service: 'Evaluación estética',
    status: 'Confirmada',
    notes: '',
  },
]

// ==========================================
// CARGAR CITAS GUARDADAS
// ==========================================

function loadAppointments() {
  try {
    const stored = localStorage.getItem(
      STORAGE_KEY
    )

    if (!stored) {
      return initialAppointments
    }

    const parsed = JSON.parse(stored)

    if (Array.isArray(parsed)) {
      return parsed
    }

    return initialAppointments

  } catch (error) {
    console.error(
      'Error al cargar las citas:',
      error
    )

    return initialAppointments
  }
}

// ==========================================
// VALIDAR DATOS DE UNA CITA
// ==========================================

function validateAppointment(appointment) {
  const patientId = Number(
    appointment.patientId
  )

  const duration = Number(
    appointment.duration
  )

  if (
    !Number.isInteger(patientId) ||
    patientId <= 0
  ) {
    return 'Selecciona un paciente válido.'
  }

  if (
    typeof appointment.service !== 'string' ||
    !appointment.service.trim()
  ) {
    return 'Selecciona el tipo de consulta.'
  }

  if (!isValidDate(appointment.date)) {
    return 'Selecciona una fecha válida.'
  }

  if (!isValidTime(appointment.time)) {
    return 'Selecciona una hora válida.'
  }

  if (
    !Number.isInteger(duration) ||
    duration <= 0
  ) {
    return 'Selecciona una duración válida.'
  }

  // Evitar que una cita termine después
  // de la medianoche.

  const endTime =
    timeToMinutes(appointment.time) + duration

  if (endTime > 1440) {
    return 'La cita no puede terminar después de medianoche.'
  }

  if (
    !APPOINTMENT_STATUSES.includes(
      appointment.status
    )
  ) {
    return 'El estado de la cita no es válido.'
  }

  return null
}

// ==========================================
// DETECTAR HORARIOS OCUPADOS
// ==========================================

function hasScheduleConflict(
  appointments,
  appointmentData,
  excludeId = null
) {
  const newStart = timeToMinutes(
    appointmentData.time
  )

  const newEnd =
    newStart + Number(appointmentData.duration)

  return appointments.some((appointment) => {

    // Ignorar la misma cita cuando se edita.

    if (
      excludeId !== null &&
      isSameId(appointment.id, excludeId)
    ) {
      return false
    }

    // Ignorar citas que no bloquean horarios.

    if (
      !BLOCKING_STATUSES.includes(
        appointment.status
      )
    ) {
      return false
    }

    // Solo comparar citas de la misma fecha.

    if (
      appointment.date !== appointmentData.date
    ) {
      return false
    }

    const existingStart = timeToMinutes(
      appointment.time
    )

    const existingEnd =
      existingStart + Number(appointment.duration)

    // Existe conflicto si los intervalos
    // de tiempo se superponen.

    return (
      newStart < existingEnd &&
      newEnd > existingStart
    )
  })
}

// ==========================================
// PROVIDER
// ==========================================

export function AppointmentsProvider({ children }) {

  // ========================================
  // ESTADO DE CITAS
  // ========================================

  const [appointments, setAppointments] = useState(
    loadAppointments
  )

  // ========================================
  // GUARDAR EN LOCALSTORAGE
  // ========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(appointments)
      )

    } catch (error) {
      console.error(
        'Error al guardar las citas:',
        error
      )
    }
  }, [appointments])

  // ========================================
  // OBTENER CITA POR ID
  // ========================================

  const getAppointmentById = (id) => {
    return appointments.find(
      (appointment) =>
        isSameId(appointment.id, id)
    )
  }

  // ========================================
  // OBTENER CITAS DE UN PACIENTE
  // ========================================

  const getPatientAppointments = (patientId) => {
    return appointments
      .filter(
        (appointment) =>
          isSameId(
            appointment.patientId,
            patientId
          )
      )
      .sort((a, b) => {
        const dateComparison =
          b.date.localeCompare(a.date)

        return dateComparison !== 0
          ? dateComparison
          : b.time.localeCompare(a.time)
      })
  }

  // ========================================
  // OBTENER CITAS DE UNA FECHA
  // ========================================

  const getAppointmentsByDate = (date) => {
    return appointments
      .filter(
        (appointment) =>
          appointment.date === date
      )
      .sort((a, b) =>
        a.time.localeCompare(b.time)
      )
  }

  // ========================================
  // CREAR CITA
  // ========================================

  const addAppointment = (appointmentData) => {

    const newAppointment = {
      ...appointmentData,

      id: crypto.randomUUID(),

      patientId: Number(
        appointmentData.patientId
      ),

      duration: Number(
        appointmentData.duration
      ),

      service:
        appointmentData.service?.trim() || '',

      status: 'Confirmada',

      notes:
        appointmentData.notes?.trim() || '',
    }

    // Validar información.

    const validationError = validateAppointment(
      newAppointment
    )

    if (validationError) {
      return {
        success: false,
        message: validationError,
      }
    }

    // Validar disponibilidad.

    if (
      hasScheduleConflict(
        appointments,
        newAppointment
      )
    ) {
      return {
        success: false,
        message:
          'El horario seleccionado ya está ocupado.',
      }
    }

    // Registrar la cita.

    setAppointments((previous) => [
      ...previous,
      newAppointment,
    ])

    return {
      success: true,
      message: 'Cita creada correctamente.',
      appointment: newAppointment,
    }
  }

  // ========================================
  // EDITAR O REPROGRAMAR CITA
  // ========================================

  const updateAppointment = (
    appointmentId,
    updatedData
  ) => {

    const existingAppointment =
      getAppointmentById(appointmentId)

    if (!existingAppointment) {
      return {
        success: false,
        message: 'La cita no existe.',
      }
    }

    // No permitimos modificar citas canceladas,
    // completadas o con inasistencia registrada.

    if (
      existingAppointment.status !== 'Confirmada'
    ) {
      return {
        success: false,
        message:
          'Solo se pueden editar citas confirmadas.',
      }
    }

    const updatedAppointment = {
      ...existingAppointment,
      ...updatedData,

      // Mantener identificador original.

      id: existingAppointment.id,

      patientId: Number(
        updatedData.patientId ??
        existingAppointment.patientId
      ),

      duration: Number(
        updatedData.duration ??
        existingAppointment.duration
      ),

      service: (
        updatedData.service ??
        existingAppointment.service
      ).trim(),

      notes: (
        updatedData.notes ??
        existingAppointment.notes ??
        ''
      ).trim(),
    }

    // Validar información.

    const validationError = validateAppointment(
      updatedAppointment
    )

    if (validationError) {
      return {
        success: false,
        message: validationError,
      }
    }

    // Validar disponibilidad cuando el estado
    // ocupa un horario.

    if (
      BLOCKING_STATUSES.includes(
        updatedAppointment.status
      ) &&
      hasScheduleConflict(
        appointments,
        updatedAppointment,
        appointmentId
      )
    ) {
      return {
        success: false,
        message:
          'El horario seleccionado ya está ocupado.',
      }
    }

    // Actualizar la cita.

    setAppointments((previous) =>
      previous.map((appointment) =>
        isSameId(
          appointment.id,
          appointmentId
        )
          ? updatedAppointment
          : appointment
      )
    )

    return {
      success: true,
      message: 'Cita actualizada correctamente.',
      appointment: updatedAppointment,
    }
  }

  // ========================================
  // CAMBIAR ESTADO DE CITA
  // ========================================

  const updateAppointmentStatus = (
    appointmentId,
    newStatus
  ) => {

    if (
      !APPOINTMENT_STATUSES.includes(newStatus)
    ) {
      return {
        success: false,
        message: 'Estado de cita no válido.',
      }
    }

    const existingAppointment =
      getAppointmentById(appointmentId)

    if (!existingAppointment) {
      return {
        success: false,
        message: 'La cita no existe.',
      }
    }

    // No modificar citas que ya tienen
    // un estado administrativo final.

    if (
      existingAppointment.status !== 'Confirmada'
    ) {
      return {
        success: false,
        message:
          'No se puede cambiar el estado de esta cita.',
      }
    }

    // Si ya está confirmada no necesitamos
    // volver a actualizarla.

    if (newStatus === 'Confirmada') {
      return {
        success: true,
        message: 'La cita ya está confirmada.',
        appointment: existingAppointment,
      }
    }

    const updatedAppointment = {
      ...existingAppointment,
      status: newStatus,
    }

    setAppointments((previous) =>
      previous.map((appointment) =>
        isSameId(
          appointment.id,
          appointmentId
        )
          ? updatedAppointment
          : appointment
      )
    )

    return {
      success: true,
      message: 'Estado actualizado correctamente.',
      appointment: updatedAppointment,
    }
  }

  // ========================================
  // CANCELAR CITA
  // ========================================

  const cancelAppointment = (appointmentId) => {
    return updateAppointmentStatus(
      appointmentId,
      'Cancelada'
    )
  }

  // ========================================
  // CONSULTAR DISPONIBILIDAD
  // ========================================

  const isTimeAvailable = (
    date,
    time,
    duration,
    excludeId = null
  ) => {

    if (
      !isValidDate(date) ||
      !isValidTime(time) ||
      !Number.isInteger(Number(duration)) ||
      Number(duration) <= 0 ||
      timeToMinutes(time) + Number(duration) > 1440
    ) {
      return false
    }

    return !hasScheduleConflict(
      appointments,
      {
        date,
        time,
        duration: Number(duration),
      },
      excludeId
    )
  }

  // ========================================
  // CONTEXTO COMPARTIDO
  // ========================================

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,

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