import { getInventoryStatus } from '../../data/inventoryMock'

import {
  getPatientRegistrationDate,
} from './patientReportFilters'

// ==========================================
// CONFIGURACIÓN GENERAL
// ==========================================

export const REPORT_CLINIC_NAME = 'Dra. Marcela Alpírez'

// Evita que un texto introducido por un usuario
// sea interpretado como fórmula en Excel.

function safeText(value) {
  const text = String(value ?? '').trim()

  if (/^[=+\-@\t\r\n]/.test(text)) {
    return `'${text}`
  }

  return text
}

function displayText(value, fallback = 'No disponible') {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  return safeText(value)
}

// ==========================================
// FORMATO DE FECHAS
// ==========================================

function formatDateKey(value) {
  if (!value) return 'No disponible'

  const match = String(value).match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  )

  if (!match) return 'No disponible'

  const [, year, month, day] = match

  return `${day}/${month}/${year}`
}

function formatPatientRegistrationDate(value) {
  return formatDateKey(getPatientRegistrationDate(value))
}

// ==========================================
// REPORTE DE INVENTARIO
// ==========================================

function buildInventoryExport(products) {
  return {
    category: 'inventory',
    title: 'Reporte de inventario',
    isDemo: true,

    columns: [
      'Código',
      'Producto',
      'Categoría',
      'Marca',
      'Existencias',
      'Stock mínimo',
      'Unidad',
      'Estado',
    ],

    rows: products.map((product) => [
      displayText(product.code),
      displayText(product.name),
      displayText(product.category),
      displayText(product.brand),
      Number(product.stock ?? 0),
      Number(product.minStock ?? 0),
      displayText(product.unit),
      getInventoryStatus(product).label,
    ]),
  }
}

// ==========================================
// REPORTE DE CITAS
// ==========================================

function buildAppointmentsExport(appointments) {
  return {
    category: 'appointments',
    title: 'Reporte de citas',
    isDemo: false,

    columns: [
      'Paciente',
      'Fecha',
      'Hora',
      'Servicio',
      'Duración (min)',
      'Estado',
    ],

    rows: appointments.map((appointment) => [
      displayText(
        appointment.patient?.name,
        'Paciente no disponible'
      ),
      formatDateKey(appointment.date),
      displayText(appointment.time),
      displayText(appointment.service),
      Number(appointment.duration ?? 0),
      displayText(appointment.status, 'Sin estado'),
    ]),
  }
}

// ==========================================
// REPORTE DE PACIENTES
// ==========================================

function buildPatientsExport(patients) {
  return {
    category: 'patients',
    title: 'Reporte de pacientes',
    isDemo: false,

    columns: [
      'Paciente',
      'Correo electrónico',
      'Teléfono',
      'Fecha de registro',
      'Estado',
    ],

    rows: patients.map((patient) => [
      displayText(patient.name, 'Sin nombre'),
      displayText(patient.email),
      displayText(patient.phone),
      formatPatientRegistrationDate(patient.createdAt),
      displayText(patient.status, 'Sin estado'),
    ]),
  }
}

// ==========================================
// REPORTE GENERAL
// ==========================================

function buildGeneralExport(summary) {
  const sections = [
    {
      name: 'Pacientes',
      values: [
        ['Total de pacientes', summary.patients.total],
        ['Pacientes activos', summary.patients.active],
        ['Pacientes inactivos', summary.patients.inactive],
        [
          summary.period?.startDate || summary.period?.endDate
            ? 'Registros del período'
            : 'Registros históricos',
          summary.patients.newRegistrations,
        ],
      ],
    },
    {
      name: 'Citas',
      values: [
        ['Total de citas', summary.appointments.total],
        ['Confirmadas', summary.appointments.confirmed],
        ['Completadas', summary.appointments.completed],
        ['Canceladas', summary.appointments.cancelled],
        ['No asistieron', summary.appointments.missed],
      ],
    },
    {
      name: 'Inventario (demostración)',
      values: [
        ['Productos registrados', summary.inventory.total],
        ['Disponibles', summary.inventory.available],
        ['Stock bajo', summary.inventory.low],
        ['Agotados', summary.inventory.out],
      ],
    },
  ]

  return {
    category: 'general',
    title: 'Reporte general de la clínica',
    isDemo: true,

    columns: [
      'Área',
      'Indicador',
      'Cantidad',
    ],

    rows: sections.flatMap((section) =>
      section.values.map(([indicator, value]) => [
        section.name,
        indicator,
        Number(value ?? 0),
      ])
    ),
  }
}

// ==========================================
// CONSTRUCTOR PRINCIPAL
// ==========================================

export function buildReportExportData({
  category,
  reportTitle = '',
  products = [],
  appointments = [],
  patients = [],
  summary = null,
  startDate = '',
  endDate = '',
} = {}) {
  let report

  switch (category) {
    case 'inventory':
      report = buildInventoryExport(products)
      break

    case 'appointments':
      report = buildAppointmentsExport(appointments)
      break

    case 'patients':
      report = buildPatientsExport(patients)
      break

    case 'general':
      if (!summary) {
        throw new Error(
          'No hay información disponible para el reporte general.'
        )
      }

      report = buildGeneralExport(summary)
      startDate = summary.period?.startDate ?? ''
      endDate = summary.period?.endDate ?? ''
      break

    default:
      throw new Error('Categoría de reporte no válida.')
  }

  return {
    ...report,

    title: reportTitle || report.title,

    filters: {
      startDate,
      endDate,
    },

    totalRows: report.rows.length,
  }
}