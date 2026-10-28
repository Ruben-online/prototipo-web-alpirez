import { REPORT_CLINIC_NAME } from './reportExportData'

// ==========================================
// CONFIGURACIÓN VISUAL
// ==========================================

const COLORS = {
  primary: '#AB49CC',
  primaryDark: '#8136A0',
  primaryLight: '#F8EDFC',
  white: '#FFFFFF',
  text: '#29232E',
  muted: '#6F6875',
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
// FORMATO DE FECHA
// ==========================================

function formatDateKey(dateString) {
  if (!dateString) return ''

  const match = String(dateString).match(
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
  const { startDate = '', endDate = '' } = filters

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
// CREAR CELDA DE TÍTULO
// ==========================================

function createTitleCell(value, columnSpan = 1) {
  return {
    value,
    type: String,
    span: columnSpan,
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'bold',
    textColor: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight,
    height: 32,
    alignVertical: 'center',
  }
}

// ==========================================
// CREAR CELDA DE INFORMACIÓN
// ==========================================

function createInfoCell(value, columnSpan = 1) {
  return {
    value: String(value),
    type: String,
    span: columnSpan,
    fontFamily: 'Arial',
    fontSize: 11,
    textColor: COLORS.muted,
    height: 24,
    alignVertical: 'center',
  }
}

// ==========================================
// CREAR CELDA DE ENCABEZADO
// ==========================================

function createHeaderCell(value) {
  return {
    value: String(value),
    type: String,
    fontFamily: 'Arial',
    fontSize: 11,
    fontWeight: 'bold',
    textColor: COLORS.white,
    backgroundColor: COLORS.primary,
    height: 30,
    alignVertical: 'center',
    wrap: true,
  }
}

// ==========================================
// CREAR CELDA DE DATOS
// ==========================================

function createDataCell(value, index) {
  const isNumber =
    typeof value === 'number' &&
    Number.isFinite(value)

  return {
    value: isNumber ? value : String(value ?? ''),
    type: isNumber ? Number : String,
    format: isNumber ? '#,##0.##' : '@',
    fontFamily: 'Arial',
    fontSize: 11,
    textColor: COLORS.text,
    backgroundColor:
      index % 2 === 0
        ? COLORS.white
        : '#FAF7FC',
    height: 25,
    alignVertical: 'center',
    wrap: true,
  }
}

// ==========================================
// CREAR FILA CON CELDAS COMBINADAS
// ==========================================

function createFullWidthRow(cell, totalColumns) {
  return [
    cell,
    ...Array.from(
      { length: Math.max(0, totalColumns - 1) },
      () => null
    ),
  ]
}

// ==========================================
// COLUMNAS DE EXCEL
// ==========================================

function getColumnWidths(columns, rows) {
  return columns.map((column, columnIndex) => {
    const maxDataLength = rows.reduce(
      (maximum, row) => {
        const length = String(
          row[columnIndex] ?? ''
        ).length

        return Math.max(maximum, length)
      },
      String(column).length
    )

    return {
      width: Math.min(
        Math.max(maxDataLength + 4, 16),
        40
      ),
    }
  })
}

// ==========================================
// NOMBRE DEL ARCHIVO
// ==========================================

function getExcelFileName(category) {
  const date = new Date()

  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Guatemala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const getPart = (type) =>
    dateParts.find(
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

  const categoryName =
    categoryNames[category] || 'reporte'

  return `reporte-${categoryName}-${dateKey}.xlsx`
}

// ==========================================
// VALIDAR INFORMACIÓN DEL REPORTE
// ==========================================

function validateExportData(reportData) {
  if (
    !reportData ||
    !Array.isArray(reportData.columns) ||
    !Array.isArray(reportData.rows) ||
    reportData.columns.length === 0
  ) {
    throw new Error(
      'La información del reporte no es válida.'
    )
  }

  const hasInvalidRows = reportData.rows.some(
    (row) =>
      !Array.isArray(row) ||
      row.length !== reportData.columns.length
  )

  if (hasInvalidRows) {
    throw new Error(
      'Las columnas del reporte no coinciden con los datos.'
    )
  }
}

// ==========================================
// CONSTRUIR CONTENIDO DEL EXCEL
// ==========================================

function buildExcelRows(reportData) {
  const {
    title,
    columns,
    rows,
    filters,
    isDemo,
  } = reportData

  const totalColumns = columns.length

  const sheetData = []

  // ========================================
  // ENCABEZADO DE LA CLÍNICA
  // ========================================

  sheetData.push(
    createFullWidthRow(
      createTitleCell(
        REPORT_CLINIC_NAME,
        totalColumns
      ),
      totalColumns
    )
  )

  // TÍTULO DEL REPORTE

  sheetData.push(
    createFullWidthRow(
      createInfoCell(
        title,
        totalColumns
      ),
      totalColumns
    )
  )

  // FECHA DE GENERACIÓN

  sheetData.push(
    createFullWidthRow(
      createInfoCell(
        `Generado: ${getGenerationDate()}`,
        totalColumns
      ),
      totalColumns
    )
  )

  // PERÍODO CONSULTADO

  sheetData.push(
    createFullWidthRow(
      createInfoCell(
        `Período: ${getPeriodDescription(filters)}`,
        totalColumns
      ),
      totalColumns
    )
  )

  // CANTIDAD DE RESULTADOS

  const resultDescription =
    reportData.category === 'general'
      ? `${rows.length} indicadores`
      : `${rows.length} registros`

  sheetData.push(
    createFullWidthRow(
      createInfoCell(
        `Resultados: ${resultDescription}`,
        totalColumns
      ),
      totalColumns
    )
  )

  // INDICADOR DE DATOS DEMOSTRATIVOS

  if (isDemo) {
    sheetData.push(
      createFullWidthRow(
        createInfoCell(
          reportData.category === 'general'
            ? 'Aviso: las cifras de inventario son demostrativas.'
            : 'Aviso: este reporte utiliza datos demostrativos.',
          totalColumns
        ),
        totalColumns
      )
    )
  }

  // SEPARACIÓN

  sheetData.push(
    Array.from(
      { length: totalColumns },
      () => null
    )
  )

  // ========================================
  // ENCABEZADOS DE TABLA
  // ========================================

  sheetData.push(
    columns.map(createHeaderCell)
  )

  // ========================================
  // REGISTROS
  // ========================================

  if (rows.length === 0) {
    sheetData.push(
      createFullWidthRow(
        createInfoCell(
          'No hay registros para los filtros seleccionados.',
          totalColumns
        ),
        totalColumns
      )
    )
  } else {
    rows.forEach((row, rowIndex) => {
      sheetData.push(
        row.map((value) =>
          createDataCell(value, rowIndex)
        )
      )
    })
  }

  return sheetData
}

// ==========================================
// EXPORTAR REPORTE A EXCEL
// ==========================================

export async function exportReportToExcel(reportData) {
  validateExportData(reportData)

  // Cargar la biblioteca únicamente cuando
  // el usuario solicite generar un Excel.

  const { default: writeExcelFile } = await import(
    'write-excel-file/browser'
  )

  const sheetData = buildExcelRows(reportData)

  const columns = getColumnWidths(
    reportData.columns,
    reportData.rows
  )

  const fileName = getExcelFileName(
    reportData.category
  )

  await writeExcelFile(sheetData, {
    sheet: 'Reporte',
    columns,
    showGridLines: false,
  }).toFile(fileName)

  return fileName
}