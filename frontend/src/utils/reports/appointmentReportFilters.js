// ==========================================
// REPORTS - APPOINTMENT REPORT TYPES
// ==========================================

export const appointmentReportTypes = [
  {
    id: 'general',
    label: 'Citas generales',
    description: 'Todas las citas registradas.',
  },
  {
    id: 'period',
    label: 'Citas por período',
    description: 'Citas dentro de un rango de fechas.',
  },
  {
    id: 'confirmed',
    label: 'Citas confirmadas',
    description: 'Citas programadas.',
  },
  {
    id: 'completed',
    label: 'Citas completadas',
    description: 'Consultas realizadas.',
  },
  {
    id: 'cancelled',
    label: 'Citas canceladas',
    description: 'Citas que fueron canceladas.',
  },
  {
    id: 'missed',
    label: 'Inasistencias',
    description: 'Citas a las que el paciente no asistió.',
  },
]

// ==========================================
// REPORTS - APPOINTMENT STATUSES
// ==========================================

export const appointmentStatuses = [
  'Todos',
  'Confirmada',
  'Completada',
  'Cancelada',
  'No asistió',
]

// ==========================================
// REPORTS - STATUS MAPPING
// ==========================================

const reportStatusMap = {
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  missed: 'No asistió',
}

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
// REPORTS - FILTER APPOINTMENTS
// ==========================================

export function filterAppointmentReport(
  appointments = [],
  {
    reportType = 'general',
    status = 'Todos',
    startDate = '',
    endDate = '',
    search = '',
  } = {}
) {
  // Validar el tipo de reporte.

  const selectedReport = appointmentReportTypes.find(
    (type) => type.id === reportType
  )

  if (!selectedReport) {
    return []
  }

  // Validar el estado seleccionado.

  if (!appointmentStatuses.includes(status)) {
    return []
  }

  // Validar el rango de fechas.

  if (
    startDate &&
    endDate &&
    startDate > endDate
  ) {
    return []
  }

  const normalizedSearch = normalizeText(search)

  // Filtrar citas.

  return appointments.filter((appointment) => {

    // ======================================
    // TIPO DE REPORTE
    // ======================================

    const requiredStatus =
      reportStatusMap[reportType]

    const matchesReportType =
      !requiredStatus ||
      appointment.status === requiredStatus

    // ======================================
    // ESTADO
    // ======================================

    const matchesStatus =
      status === 'Todos' ||
      appointment.status === status

    // ======================================
    // FECHAS
    // ======================================

    const matchesStartDate =
      !startDate ||
      appointment.date >= startDate

    const matchesEndDate =
      !endDate ||
      appointment.date <= endDate

    // ======================================
    // BÚSQUEDA
    // ======================================

    const searchableText = normalizeText([
      appointment.patient?.name,
      appointment.service,
    ].filter(Boolean).join(' '))

    const matchesSearch =
      searchableText.includes(normalizedSearch)

    return (
      matchesReportType &&
      matchesStatus &&
      matchesStartDate &&
      matchesEndDate &&
      matchesSearch
    )
  })
    .sort((first, second) => {
      const dateComparison =
        first.date.localeCompare(second.date)

      if (dateComparison !== 0) {
        return dateComparison
      }

      return first.time.localeCompare(second.time)
    })
}