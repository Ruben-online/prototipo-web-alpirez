import { useState } from 'react'

import {
  FileDown,
  FileSpreadsheet,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

import { buildReportExportData } from '../../utils/reports/reportExportData'

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function ReportExportActions({
  category,
  reportTitle,
  products = [],
  appointments = [],
  patients = [],
  summary = null,
  startDate = '',
  endDate = '',
  disabled = false,
}) {
  const [exporting, setExporting] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ========================================
  // GENERAR Y DESCARGAR
  // ========================================

  const handleExport = async (format) => {
    if (exporting || disabled) return

    setExporting(format)
    setError('')
    setSuccess('')

    try {
      const reportData = buildReportExportData({
        category,
        reportTitle,
        products,
        appointments,
        patients,
        summary,
        startDate,
        endDate,
      })

      if (format === 'pdf') {
        const { exportReportToPdf } = await import(
          '../../utils/reports/exportPdf'
        )

        await exportReportToPdf(reportData)
      } else {
        const { exportReportToExcel } = await import(
          '../../utils/reports/exportExcel'
        )

        await exportReportToExcel(reportData)
      }

      setSuccess(
        `Reporte ${format.toUpperCase()} generado correctamente.`
      )
    } catch (err) {
      console.error('Error al exportar reporte:', err)

      setError(
        'No fue posible generar el archivo. Intenta nuevamente.'
      )
    } finally {
      setExporting(null)
    }
  }

  const isBusy = exporting !== null

  return (
    <section
      className="report-export-actions"
      aria-label="Exportar reporte"
    >
      <div className="report-export-actions-header">
        <div>
          <span className="dashboard-panel-eyebrow">
            EXPORTACIÓN
          </span>

          <h3>Descargar reporte</h3>

          <p>
            Guarda los resultados de este reporte
            en PDF o Excel.
          </p>
        </div>

        <div className="report-export-buttons">
          <button
            type="button"
            className="report-export-button pdf"
            disabled={disabled || isBusy}
            onClick={() => handleExport('pdf')}
          >
            {exporting === 'pdf' ? (
              <LoaderCircle
                size={19}
                className="report-export-spinner"
              />
            ) : (
              <FileDown size={19} />
            )}

            <span>
              {exporting === 'pdf'
                ? 'Generando PDF...'
                : 'Descargar PDF'}
            </span>
          </button>

          <button
            type="button"
            className="report-export-button excel"
            disabled={disabled || isBusy}
            onClick={() => handleExport('excel')}
          >
            {exporting === 'excel' ? (
              <LoaderCircle
                size={19}
                className="report-export-spinner"
              />
            ) : (
              <FileSpreadsheet size={19} />
            )}

            <span>
              {exporting === 'excel'
                ? 'Generando Excel...'
                : 'Descargar Excel'}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div
          className="report-export-message error"
          role="alert"
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="report-export-message success"
          role="status"
        >
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {disabled && (
        <p className="report-export-disabled">
          Los archivos estarán disponibles cuando
          los datos terminen de cargar y los filtros
          sean válidos.
        </p>
      )}
    </section>
  )
}

export default ReportExportActions