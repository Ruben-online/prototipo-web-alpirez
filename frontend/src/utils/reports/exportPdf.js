import { REPORT_CLINIC_NAME } from './reportExportData'

// ==========================================
// CONFIGURACIÓN VISUAL
// ==========================================

const COLORS = {
  primary: [171, 73, 204],
  primaryDark: [129, 54, 160],
  primaryLight: [248, 237, 252],
  white: [255, 255, 255],
  text: [41, 35, 46],
  muted: [111, 104, 117],
  border: [235, 229, 238],
}

// ==========================================
// FECHA DE GENERACIÓN
// ==========================================

function getGenerationDate() {
  return new Intl.DateTimeFormat('es-GT', {
    timeZone: 'America/Guatemala',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

// ==========================================
// FORMATO DE FECHAS
// ==========================================

function formatDateKey(value) {
  if (!value) return ''

  const match = String(value).match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  )

  if (!match) return ''

  const [, year, month, day] = match

  return `${day}/${month}/${year}`
}

// ==========================================
// DESCRIPCIÓN DEL PERÍODO
// ==========================================

function getPeriodDescription(filters = {}) {
  const {
    startDate = '',
    endDate = '',
  } = filters

  if (!startDate && !endDate) {
    return 'Sin restricción de fechas'
  }

  if (startDate && endDate) {
    return (
      `Del ${formatDateKey(startDate)} ` +
      `al ${formatDateKey(endDate)}`
    )
  }

  if (startDate) {
    return `Desde el ${formatDateKey(startDate)}`
  }

  return `Hasta el ${formatDateKey(endDate)}`
}

// ==========================================
// NOMBRE DEL ARCHIVO
// ==========================================

function getPdfFileName(category) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Guatemala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const getPart = (type) =>
    parts.find(
      (part) => part.type === type
    )?.value ?? ''

  const dateKey = [
    getPart('year'),
    getPart('month'),
    getPart('day'),
  ].join('-')

  const categoryNames = {
    inventory: 'inventario',
    appointments: 'citas',
    patients: 'pacientes',
    general: 'general',
  }

  const name =
    categoryNames[category] ?? 'reporte'

  return `reporte-${name}-${dateKey}.pdf`
}

// ==========================================
// VALIDAR DATOS
// ==========================================

function validateReportData(reportData) {
  if (
    !reportData ||
    !Array.isArray(reportData.columns) ||
    !Array.isArray(reportData.rows) ||
    reportData.columns.length === 0
  ) {
    throw new Error(
      'La información del reporte PDF no es válida.'
    )
  }

  const invalidRows = reportData.rows.some(
    (row) =>
      !Array.isArray(row) ||
      row.length !== reportData.columns.length
  )

  if (invalidRows) {
    throw new Error(
      'Los datos del reporte no coinciden con sus columnas.'
    )
  }
}

// ==========================================
// CONVERTIR DATOS PARA LA TABLA
// ==========================================

function getTableRows(reportData) {
  if (reportData.rows.length === 0) {
    return [
      [
        'No hay resultados para los filtros seleccionados.',
        ...Array(
          reportData.columns.length - 1
        ).fill(''),
      ],
    ]
  }

  return reportData.rows.map((row) =>
    row.map((value) =>
      value === null || value === undefined
        ? ''
        : String(value)
    )
  )
}

// ==========================================
// ENCABEZADO DE CADA PÁGINA
// ==========================================

function drawPageHeader(doc, reportData) {
  const pageWidth =
    doc.internal.pageSize.getWidth()

  const margin = 14

  // Franja superior de identidad visual.

  doc.setFillColor(...COLORS.primary)
  doc.rect(0, 0, pageWidth, 7, 'F')

  // Nombre de la clínica.

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(...COLORS.primaryDark)

  doc.text(
    REPORT_CLINIC_NAME,
    margin,
    18
  )

  // Título del reporte.

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.text)

  const availableWidth =
    pageWidth - margin * 2

  const titleLines = doc.splitTextToSize(
    String(reportData.title || 'Reporte'),
    availableWidth
  )

  doc.text(
    titleLines.slice(0, 2),
    margin,
    27
  )

  // Información de generación.

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLORS.muted)

  doc.text(
    `Generado: ${getGenerationDate()}`,
    margin,
    39
  )

  doc.text(
    `Período: ${getPeriodDescription(reportData.filters)}`,
    margin,
    45
  )

  // Indicar si existen datos demostrativos.

  if (reportData.isDemo) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(155, 100, 26)

    const demoMessage =
      reportData.category === 'general'
        ? 'Aviso: las cifras de inventario son demostrativas.'
        : 'Aviso: este reporte utiliza datos demostrativos.'

    doc.text(
      demoMessage,
      margin,
      52
    )
  }

  // Línea divisoria.

  doc.setDrawColor(...COLORS.border)
  doc.setLineWidth(0.4)

  doc.line(
    margin,
    58,
    pageWidth - margin,
    58
  )
}

// ==========================================
// PIE DE PÁGINA
// ==========================================

function drawPageFooters(doc) {
  const totalPages =
    doc.internal.getNumberOfPages()

  const pageWidth =
    doc.internal.pageSize.getWidth()

  const pageHeight =
    doc.internal.pageSize.getHeight()

  for (
    let page = 1;
    page <= totalPages;
    page += 1
  ) {
    doc.setPage(page)

    doc.setDrawColor(...COLORS.border)
    doc.setLineWidth(0.3)

    doc.line(
      14,
      pageHeight - 15,
      pageWidth - 14,
      pageHeight - 15
    )

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...COLORS.muted)

    doc.text(
      'Reporte administrativo de la clínica',
      14,
      pageHeight - 10
    )

    doc.text(
      `Página ${page} de ${totalPages}`,
      pageWidth - 14,
      pageHeight - 10,
      { align: 'right' }
    )
  }
}

// ==========================================
// EXPORTAR REPORTE A PDF
// ==========================================

export async function exportReportToPdf(reportData) {
  validateReportData(reportData)

  // Cargar las bibliotecas solamente cuando
  // el usuario solicite un documento PDF.

  const [
    { jsPDF },
    { autoTable },
  ] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  // Utilizar orientación horizontal para
  // reportes con muchas columnas.

  const landscapeCategories = [
    'inventory',
    'appointments',
    'patients',
  ]

  const orientation =
    landscapeCategories.includes(reportData.category)
      ? 'landscape'
      : 'portrait'

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  })

  doc.setProperties({
    title: reportData.title,
    subject: 'Reporte administrativo',
    author: REPORT_CLINIC_NAME,
    creator: 'Sistema de administración',
  })

  // ========================================
  // GENERAR TABLA
  // ========================================

  autoTable(doc, {
    head: [reportData.columns],
    body: getTableRows(reportData),

    startY: 65,

    margin: {
      top: 65,
      right: 14,
      bottom: 22,
      left: 14,
    },

    theme: 'grid',

    styles: {
      font: 'helvetica',
      fontSize:
        reportData.columns.length > 6
          ? 8
          : 9,

      cellPadding: 3,
      overflow: 'linebreak',
      valign: 'middle',

      textColor: COLORS.text,
      lineColor: COLORS.border,
      lineWidth: 0.2,
    },

    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },

    alternateRowStyles: {
      fillColor: [252, 248, 254],
    },

    // Repetir el encabezado de la tabla
    // si el reporte ocupa varias páginas.

    showHead: 'everyPage',

    // Dibujar el encabezado institucional
    // en todas las páginas del documento.

    willDrawPage: () => {
      drawPageHeader(doc, reportData)
    },
  })

  // ========================================
  // AGREGAR NUMERACIÓN
  // ========================================

  drawPageFooters(doc)

  // ========================================
  // DESCARGAR ARCHIVO
  // ========================================

  const fileName = getPdfFileName(
    reportData.category
  )

  doc.save(fileName)

  return fileName
}