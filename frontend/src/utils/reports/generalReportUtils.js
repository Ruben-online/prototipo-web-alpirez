import { getInventoryStatus } from '../../data/inventoryMock'

// ==========================================
// REPORTES GENERALES - FECHAS
// ==========================================

// Convierte una fecha de Supabase al formato
// YYYY-MM-DD utilizando la zona horaria
// de Guatemala.
//
// Para fechas de citas que ya vienen como
// YYYY-MM-DD, conserva su valor original.

function getLocalDateKey(value) {
  if (!value) return ''

  const text = String(value)

  // Evitar cambios de día al interpretar
  // fechas que no contienen una hora.
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Guatemala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const getPart = (type) =>
    parts.find((part) => part.type === type)?.value ?? ''

  return [
    getPart('year'),
    getPart('month'),
    getPart('day'),
  ].join('-')
}

// ==========================================
// REPORTES GENERALES - VALIDAR FECHAS
// ==========================================

export function isGeneralReportDateRangeValid(
  startDate = '',
  endDate = ''
) {
  return !(
    startDate &&
    endDate &&
    startDate > endDate
  )
}

// ==========================================
// REPORTES GENERALES - FILTRAR POR FECHAS
// ==========================================

function isDateWithinRange(
  date,
  startDate = '',
  endDate = ''
) {
  if (!startDate && !endDate) {
    return true
  }

  if (!date) {
    return false
  }

  return (
    (!startDate || date >= startDate) &&
    (!endDate || date <= endDate)
  )
}

// ==========================================
// REPORTES GENERALES - PACIENTES
// ==========================================

function getPatientsSummary(
  patients,
  startDate,
  endDate
) {
  // Pacientes registrados durante el período.
  const registeredPatients = patients.filter(
    (patient) => {
      const registrationDate = getLocalDateKey(
        patient.createdAt
      )

      return isDateWithinRange(
        registrationDate,
        startDate,
        endDate
      )
    }
  )

  // Estadísticas del total de pacientes.
  return {
    total: patients.length,

    active: patients.filter(
      (patient) => patient.status === 'Activo'
    ).length,

    inactive: patients.filter(
      (patient) => patient.status === 'Inactivo'
    ).length,

    newRegistrations: registeredPatients.length,
  }
}

// ==========================================
// REPORTES GENERALES - CITAS
// ==========================================

function getAppointmentsSummary(
  appointments,
  startDate,
  endDate
) {
  const filteredAppointments = appointments.filter(
    (appointment) =>
      isDateWithinRange(
        appointment.date,
        startDate,
        endDate
      )
  )

  return {
    total: filteredAppointments.length,

    confirmed: filteredAppointments.filter(
      (appointment) =>
        appointment.status === 'Confirmada'
    ).length,

    completed: filteredAppointments.filter(
      (appointment) =>
        appointment.status === 'Completada'
    ).length,

    cancelled: filteredAppointments.filter(
      (appointment) =>
        appointment.status === 'Cancelada'
    ).length,

    missed: filteredAppointments.filter(
      (appointment) =>
        appointment.status === 'No asistió'
    ).length,
  }
}

// ==========================================
// REPORTES GENERALES - INVENTARIO
// ==========================================

function getInventorySummary(products) {
  const summary = {
    total: products.length,
    available: 0,
    low: 0,
    out: 0,
  }

  products.forEach((product) => {
    const status = getInventoryStatus(product)

    if (status.type === 'available') {
      summary.available += 1
    }

    if (status.type === 'low') {
      summary.low += 1
    }

    if (status.type === 'out') {
      summary.out += 1
    }
  })

  return summary
}

// ==========================================
// REPORTES GENERALES - RESUMEN COMPLETO
// ==========================================

export function getGeneralReportSummary({
  patients = [],
  appointments = [],
  products = [],
  startDate = '',
  endDate = '',
} = {}) {
  // Verificar que las fechas sean válidas.
  const validDateRange =
    isGeneralReportDateRangeValid(
      startDate,
      endDate
    )

  if (!validDateRange) {
    return null
  }

  // Calcular las estadísticas.
  return {
    patients: getPatientsSummary(
      patients,
      startDate,
      endDate
    ),

    appointments: getAppointmentsSummary(
      appointments,
      startDate,
      endDate
    ),

    inventory: getInventorySummary(products),

    period: {
      startDate,
      endDate,
    },
  }
}