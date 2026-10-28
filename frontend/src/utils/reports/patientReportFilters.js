// ==========================================
// REPORTES DE PACIENTES - TIPOS
// ==========================================

export const patientReportTypes = [
  {
    id: 'general',
    label: 'Pacientes generales',
    description: 'Todos los pacientes registrados.',
  },
  {
    id: 'new',
    label: 'Pacientes nuevos',
    description: 'Pacientes registrados durante un período.',
  },
  {
    id: 'active',
    label: 'Pacientes activos',
    description: 'Pacientes que se encuentran activos.',
  },
  {
    id: 'inactive',
    label: 'Pacientes inactivos',
    description: 'Pacientes que se encuentran inactivos.',
  },
  {
    id: 'summary',
    label: 'Resumen de pacientes',
    description: 'Resumen administrativo de pacientes.',
  },
]

// ==========================================
// ESTADOS DE PACIENTES
// ==========================================

export const patientStatuses = [
  'Todos',
  'Activo',
  'Inactivo',
]

// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// ==========================================
// FECHAS DE REGISTRO
// ==========================================

// Convierte las fechas de Supabase a YYYY-MM-DD
// utilizando la zona horaria de Guatemala.
//
// Si ya recibimos una fecha sin hora, conservamos
// ese día para evitar desplazamientos por zona horaria.

export function getPatientRegistrationDate(value) {
  if (!value) return ''

  const text = String(value)

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
// VALIDAR FILTROS
// ==========================================

export function isPatientReportValid({
  reportType = 'general',
  status = 'Todos',
  startDate = '',
  endDate = '',
} = {}) {
  const validReport = patientReportTypes.some(
    (type) => type.id === reportType
  )

  if (!validReport) return false

  if (!patientStatuses.includes(status)) {
    return false
  }

  if (startDate && endDate && startDate > endDate) {
    return false
  }

  // El reporte de nuevos pacientes necesita
  // ambas fechas para definir el período.

  if (
    reportType === 'new' &&
    (!startDate || !endDate)
  ) {
    return false
  }

  return true
}

// ==========================================
// FILTRAR PACIENTES
// ==========================================

export function filterPatientReport(
  patients = [],
  {
    reportType = 'general',
    status = 'Todos',
    startDate = '',
    endDate = '',
    search = '',
  } = {}
) {
  const validFilters = isPatientReportValid({
    reportType,
    status,
    startDate,
    endDate,
  })

  if (!validFilters) {
    return []
  }

  const normalizedSearch = normalizeText(search)

  // Reportes activos/inactivos tienen un estado
  // fijo, sin depender de un selector oculto.

  const requiredStatus = {
    active: 'Activo',
    inactive: 'Inactivo',
  }[reportType]

  const effectiveStatus =
    requiredStatus || status

  return patients
    .filter((patient) => {
      // ======================================
      // ESTADO
      // ======================================

      const matchesStatus =
        effectiveStatus === 'Todos' ||
        patient.status === effectiveStatus

      // ======================================
      // FECHA DE REGISTRO
      // ======================================

      const registrationDate =
        getPatientRegistrationDate(patient.createdAt)

      const matchesStartDate =
        !startDate ||
        (
          registrationDate !== '' &&
          registrationDate >= startDate
        )

      const matchesEndDate =
        !endDate ||
        (
          registrationDate !== '' &&
          registrationDate <= endDate
        )

      // ======================================
      // BÚSQUEDA
      // ======================================

      const searchableText = normalizeText([
        patient.name,
        patient.email,
        patient.phone,
      ].filter(Boolean).join(' '))

      const matchesSearch =
        searchableText.includes(normalizedSearch)

      return (
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate &&
        matchesSearch
      )
    })
    .sort((first, second) =>
      String(first.name ?? '').localeCompare(
        String(second.name ?? ''),
        'es'
      )
    )
}

// ==========================================
// RESUMEN ADMINISTRATIVO
// ==========================================

export function getPatientReportSummary(patients = []) {
  return {
    total: patients.length,

    active: patients.filter(
      (patient) => patient.status === 'Activo'
    ).length,

    inactive: patients.filter(
      (patient) => patient.status === 'Inactivo'
    ).length,

    consultations: patients.reduce(
      (total, patient) =>
        total + Number(patient.consultations || 0),
      0
    ),
  }
}