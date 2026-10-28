import { useMemo, useState } from 'react'

import {
  Boxes,
  CalendarDays,
  UsersRound,
  ChartNoAxesCombined,
  ArrowUpRight,
  FileText,
  ArrowLeft,
} from 'lucide-react'

// ==========================================
// COMPONENTES DE REPORTES
// ==========================================

import ReportsFilters from '../components/reports/ReportsFilters'
import ReportsPreview from '../components/reports/ReportsPreview'

import AppointmentReportsFilters from '../components/reports/AppointmentReportsFilters'
import AppointmentReportsPreview from '../components/reports/AppointmentReportsPreview'

import PatientReportsFilters from '../components/reports/PatientReportsFilters'
import PatientReportsPreview from '../components/reports/PatientReportsPreview'

import GeneralReportsFilters from '../components/reports/GeneralReportsFilters'
import GeneralReportsPreview from '../components/reports/GeneralReportsPreview'

import ReportExportActions from '../components/reports/ReportExportActions'

// ==========================================
// DATOS Y CONTEXTOS
// ==========================================

import { inventoryMock } from '../data/inventoryMock'

import { useAppointments } from '../hooks/useAppointments'
import { usePatients } from '../hooks/usePatients'

// ==========================================
// UTILIDADES
// ==========================================

import {
  filterInventoryReport,
  inventoryReportTypes,
} from '../utils/reports/reportFilters'

import {
  filterAppointmentReport,
  appointmentReportTypes,
} from '../utils/reports/appointmentReportFilters'

import {
  filterPatientReport,
  patientReportTypes,
} from '../utils/reports/patientReportFilters'

import {
  getGeneralReportSummary,
  isGeneralReportDateRangeValid,
} from '../utils/reports/generalReportUtils'

// ==========================================
// ESTILOS
// ==========================================

import '../styles/reports/reports.css'
import '../styles/reports/reports-filters.css'
import '../styles/reports/reports-preview.css'

import '../styles/reports/appointment-reports-filters.css'
import '../styles/reports/appointment-reports-preview.css'

import '../styles/reports/patient-reports-preview.css'
import '../styles/reports/general-reports-preview.css'

import '../styles/reports/report-export-actions.css'

// ==========================================
// CATEGORÍAS
// ==========================================

const reportCategories = [
  {
    id: 'inventory',
    title: 'Inventario',
    description:
      'Consulta existencias, productos agotados y el estado general del inventario.',
    icon: Boxes,
    type: 'inventory',
    reports: [
      'Inventario general',
      'Productos con stock bajo',
      'Productos agotados',
      'Control de vencimientos',
    ],
  },
  {
    id: 'appointments',
    title: 'Citas',
    description:
      'Analiza la actividad de la agenda y los estados de las citas.',
    icon: CalendarDays,
    type: 'appointments',
    reports: [
      'Citas generales',
      'Citas por período',
      'Citas completadas',
      'Citas canceladas',
      'Citas confirmadas',
      'Inasistencias',
    ],
  },
  {
    id: 'patients',
    title: 'Pacientes',
    description:
      'Consulta estadísticas administrativas sobre los pacientes registrados.',
    icon: UsersRound,
    type: 'patients',
    reports: [
      'Pacientes generales',
      'Pacientes nuevos',
      'Pacientes activos',
      'Pacientes inactivos',
      'Resumen de pacientes',
    ],
  },
  {
    id: 'general',
    title: 'Reporte general',
    description:
      'Obtén una visión general de la actividad administrativa de la clínica.',
    icon: ChartNoAxesCombined,
    type: 'general',
    reports: [
      'Resumen de pacientes',
      'Actividad de citas',
      'Estado del inventario',
      'Estadísticas generales',
    ],
  },
]

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function Reports() {
  // ========================================
  // CONTEXTOS
  // ========================================

  const {
    appointments,
    loading: appointmentsLoading,
  } = useAppointments()

  const {
    patients,
    loading: patientsLoading,
    error: patientsError,
  } = usePatients()

  // ========================================
  // NAVEGACIÓN
  // ========================================

  const [activeCategory, setActiveCategory] = useState(null)

  // ========================================
  // FILTROS DE INVENTARIO
  // ========================================

  const [inventoryReportType, setInventoryReportType] =
    useState('general')

  const [inventoryCategory, setInventoryCategory] =
    useState('Todas')

  const [inventorySearch, setInventorySearch] =
    useState('')

  // ========================================
  // FILTROS DE CITAS
  // ========================================

  const [appointmentReportType, setAppointmentReportType] =
    useState('general')

  const [appointmentStatus, setAppointmentStatus] =
    useState('Todos')

  const [appointmentStartDate, setAppointmentStartDate] =
    useState('')

  const [appointmentEndDate, setAppointmentEndDate] =
    useState('')

  const [appointmentSearch, setAppointmentSearch] =
    useState('')

  // ========================================
  // FILTROS DE PACIENTES
  // ========================================

  const [patientReportType, setPatientReportType] =
    useState('general')

  const [patientStatus, setPatientStatus] =
    useState('Todos')

  const [patientStartDate, setPatientStartDate] =
    useState('')

  const [patientEndDate, setPatientEndDate] =
    useState('')

  const [patientSearch, setPatientSearch] =
    useState('')

  // ========================================
  // FILTROS DEL REPORTE GENERAL
  // ========================================

  const [generalStartDate, setGeneralStartDate] =
    useState('')

  const [generalEndDate, setGeneralEndDate] =
    useState('')

  // ========================================
  // INVENTARIO: CATEGORÍAS
  // ========================================

  const inventoryCategories = useMemo(
    () => [
      'Todas',
      ...new Set(
        inventoryMock
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ],
    []
  )

  // ========================================
  // INVENTARIO: RESULTADOS
  // ========================================

  const filteredProducts = useMemo(
    () =>
      filterInventoryReport(inventoryMock, {
        reportType: inventoryReportType,
        category: inventoryCategory,
        search: inventorySearch,
      }),
    [
      inventoryReportType,
      inventoryCategory,
      inventorySearch,
    ]
  )

  const inventoryReportTitle =
    inventoryReportTypes.find(
      (type) => type.id === inventoryReportType
    )?.label ?? 'Inventario general'

  // ========================================
  // CITAS: VALIDACIÓN
  // ========================================

  const invalidAppointmentDateRange = Boolean(
    appointmentStartDate &&
    appointmentEndDate &&
    appointmentStartDate > appointmentEndDate
  )

  const missingAppointmentDateRange =
    appointmentReportType === 'period' &&
    (!appointmentStartDate || !appointmentEndDate)

  const appointmentFiltersValid =
    !invalidAppointmentDateRange &&
    !missingAppointmentDateRange

  // ========================================
  // CITAS: RESULTADOS
  // ========================================

  const filteredAppointments = useMemo(() => {
    if (!appointmentFiltersValid) {
      return []
    }

    return filterAppointmentReport(appointments, {
      reportType: appointmentReportType,
      status: appointmentStatus,
      startDate: appointmentStartDate,
      endDate: appointmentEndDate,
      search: appointmentSearch,
    })
  }, [
    appointments,
    appointmentReportType,
    appointmentStatus,
    appointmentStartDate,
    appointmentEndDate,
    appointmentSearch,
    appointmentFiltersValid,
  ])

  const appointmentReportTitle =
    appointmentReportTypes.find(
      (type) => type.id === appointmentReportType
    )?.label ?? 'Citas generales'

  // ========================================
  // PACIENTES: VALIDACIÓN
  // ========================================

  const invalidPatientDateRange = Boolean(
    patientStartDate &&
    patientEndDate &&
    patientStartDate > patientEndDate
  )

  const missingPatientDateRange =
    patientReportType === 'new' &&
    (!patientStartDate || !patientEndDate)

  const patientFiltersValid =
    !invalidPatientDateRange &&
    !missingPatientDateRange

  // ========================================
  // PACIENTES: RESULTADOS
  // ========================================

  const filteredPatients = useMemo(() => {
    if (!patientFiltersValid) {
      return []
    }

    return filterPatientReport(patients, {
      reportType: patientReportType,
      status: patientStatus,
      startDate: patientStartDate,
      endDate: patientEndDate,
      search: patientSearch,
    })
  }, [
    patients,
    patientReportType,
    patientStatus,
    patientStartDate,
    patientEndDate,
    patientSearch,
    patientFiltersValid,
  ])

  const patientReportTitle =
    patientReportTypes.find(
      (type) => type.id === patientReportType
    )?.label ?? 'Pacientes generales'

  // ========================================
  // REPORTE GENERAL: VALIDACIÓN
  // ========================================

  const generalFiltersValid =
    isGeneralReportDateRangeValid(
      generalStartDate,
      generalEndDate
    )

  // ========================================
  // REPORTE GENERAL: RESULTADOS
  // ========================================

  const generalSummary = useMemo(() => {
    if (!generalFiltersValid) {
      return null
    }

    return getGeneralReportSummary({
      patients,
      appointments,
      products: inventoryMock,
      startDate: generalStartDate,
      endDate: generalEndDate,
    })
  }, [
    patients,
    appointments,
    generalStartDate,
    generalEndDate,
    generalFiltersValid,
  ])

  const generalLoading =
    patientsLoading || appointmentsLoading

  // ========================================
  // SELECCIONAR CATEGORÍA
  // ========================================

  const handleSelectCategory = (categoryId) => {
    const availableCategories = [
      'inventory',
      'appointments',
      'patients',
      'general',
    ]

    if (!availableCategories.includes(categoryId)) {
      return
    }

    setActiveCategory(categoryId)
  }

  // ========================================
  // LIMPIAR FILTROS
  // ========================================

  const clearInventoryFilters = () => {
    setInventoryReportType('general')
    setInventoryCategory('Todas')
    setInventorySearch('')
  }

  const clearAppointmentFilters = () => {
    setAppointmentReportType('general')
    setAppointmentStatus('Todos')
    setAppointmentStartDate('')
    setAppointmentEndDate('')
    setAppointmentSearch('')
  }

  const clearPatientFilters = () => {
    setPatientReportType('general')
    setPatientStatus('Todos')
    setPatientStartDate('')
    setPatientEndDate('')
    setPatientSearch('')
  }

  const clearGeneralFilters = () => {
    setGeneralStartDate('')
    setGeneralEndDate('')
  }

  // ========================================
  // CAMBIAR TIPO DE REPORTE
  // ========================================

  const handleAppointmentReportTypeChange = (value) => {
    setAppointmentReportType(value)
    setAppointmentStatus('Todos')
  }

  const handlePatientReportTypeChange = (value) => {
    setPatientReportType(value)
    setPatientStatus('Todos')
  }

  // ========================================
  // VOLVER A CATEGORÍAS
  // ========================================

  const handleBack = () => {
    setActiveCategory(null)

    clearInventoryFilters()
    clearAppointmentFilters()
    clearPatientFilters()
    clearGeneralFilters()
  }

  // ========================================
  // INTERFAZ
  // ========================================

  return (
    <div className="reports-page">

      {/* ENCABEZADO */}

      <section className="reports-heading">
        <div>
          <span className="dashboard-section-eyebrow">
            INFORMES Y ESTADÍSTICAS
          </span>

          <h2>Reportes y estadísticas</h2>

          <p>
            Consulta información administrativa de la clínica
            y genera reportes personalizados.
          </p>
        </div>

        <div className="reports-heading-icon">
          <FileText
            size={25}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </div>
      </section>

      {/* AVISO INFORMATIVO */}

      <div className="reports-demo-notice" role="note">
        <FileText
          size={18}
          strokeWidth={1.8}
          aria-hidden="true"
        />

        <p>
          <strong>Información del módulo.</strong>{' '}
          Inventario utiliza datos demostrativos.
          Los reportes de citas y pacientes utilizan
          la información disponible en el sistema.
        </p>
      </div>

      {/* ======================================
          CATEGORÍAS
      ====================================== */}

      {!activeCategory && (
        <section
          className="reports-categories-section"
          aria-labelledby="reports-categories-title"
        >
          <div className="reports-section-heading">
            <div>
              <span className="dashboard-panel-eyebrow">
                EXPLORAR REPORTES
              </span>

              <h3 id="reports-categories-title">
                Categorías disponibles
              </h3>

              <p>
                Selecciona el área sobre la que deseas
                consultar información.
              </p>
            </div>

            <span className="reports-total-badge">
              {reportCategories.length} categorías
            </span>
          </div>

          <div className="reports-categories-grid">
            {reportCategories.map((item) => {
              const Icon = item.icon

              return (
                <article
                  key={item.id}
                  className={`reports-category-card ${item.type}`}
                >
                  <div className="reports-category-top">
                    <div className="reports-category-icon">
                      <Icon
                        size={24}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <span className="reports-category-count">
                      {item.reports.length} reportes
                    </span>
                  </div>

                  <div className="reports-category-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>

                    <ul>
                      {item.reports.map((report) => (
                        <li key={report}>{report}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="reports-category-footer">
                    <button
                      type="button"
                      className="reports-category-action"
                      onClick={() =>
                        handleSelectCategory(item.id)
                      }
                    >
                      <span>Ver reportes</span>

                      <ArrowUpRight
                        size={19}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* ======================================
          INVENTARIO
      ====================================== */}

      {activeCategory === 'inventory' && (
        <section className="reports-inventory-section">

          <button
            type="button"
            className="reports-back-button"
            onClick={handleBack}
          >
            <ArrowLeft size={19} strokeWidth={1.8} />
            Volver a categorías
          </button>

          <ReportsFilters
            reportType={inventoryReportType}
            category={inventoryCategory}
            search={inventorySearch}
            categories={inventoryCategories}
            onReportTypeChange={setInventoryReportType}
            onCategoryChange={setInventoryCategory}
            onSearchChange={setInventorySearch}
            onClearFilters={clearInventoryFilters}
          />

          <ReportsPreview
            products={filteredProducts}
            reportTitle={inventoryReportTitle}
          />

          <ReportExportActions
            category="inventory"
            reportTitle={inventoryReportTitle}
            products={filteredProducts}
          />

        </section>
      )}

      {/* ======================================
          CITAS
      ====================================== */}

      {activeCategory === 'appointments' && (
        <section className="reports-appointments-section">

          <button
            type="button"
            className="reports-back-button"
            onClick={handleBack}
          >
            <ArrowLeft size={19} strokeWidth={1.8} />
            Volver a categorías
          </button>

          <AppointmentReportsFilters
            reportType={appointmentReportType}
            status={appointmentStatus}
            startDate={appointmentStartDate}
            endDate={appointmentEndDate}
            search={appointmentSearch}
            onReportTypeChange={
              handleAppointmentReportTypeChange
            }
            onStatusChange={setAppointmentStatus}
            onStartDateChange={setAppointmentStartDate}
            onEndDateChange={setAppointmentEndDate}
            onSearchChange={setAppointmentSearch}
            onClearFilters={clearAppointmentFilters}
          />

          {appointmentFiltersValid ? (
            <>
              <AppointmentReportsPreview
                appointments={filteredAppointments}
                reportTitle={appointmentReportTitle}
                loading={appointmentsLoading}
              />

              <ReportExportActions
                category="appointments"
                reportTitle={appointmentReportTitle}
                appointments={filteredAppointments}
                startDate={appointmentStartDate}
                endDate={appointmentEndDate}
                disabled={appointmentsLoading}
              />
            </>
          ) : (
            <div
              className="appointment-reports-date-hint"
              role="status"
            >
              Corrige o completa el rango de fechas
              para visualizar los resultados.
            </div>
          )}

        </section>
      )}

      {/* ======================================
          PACIENTES
      ====================================== */}

      {activeCategory === 'patients' && (
        <section className="reports-patients-section">

          <button
            type="button"
            className="reports-back-button"
            onClick={handleBack}
          >
            <ArrowLeft size={19} strokeWidth={1.8} />
            Volver a categorías
          </button>

          <PatientReportsFilters
            reportType={patientReportType}
            status={patientStatus}
            startDate={patientStartDate}
            endDate={patientEndDate}
            search={patientSearch}
            onReportTypeChange={
              handlePatientReportTypeChange
            }
            onStatusChange={setPatientStatus}
            onStartDateChange={setPatientStartDate}
            onEndDateChange={setPatientEndDate}
            onSearchChange={setPatientSearch}
            onClearFilters={clearPatientFilters}
          />

          {patientFiltersValid ? (
            <>
              <PatientReportsPreview
                patients={filteredPatients}
                reportTitle={patientReportTitle}
                loading={patientsLoading}
                error={patientsError}
                showSummary={patientReportType === 'summary'}
              />

              <ReportExportActions
                category="patients"
                reportTitle={patientReportTitle}
                patients={filteredPatients}
                startDate={patientStartDate}
                endDate={patientEndDate}
                disabled={
                  patientsLoading || Boolean(patientsError)
                }
              />
            </>
          ) : (
            <div
              className="appointment-reports-date-hint"
              role="status"
            >
              Corrige o completa el rango de fechas
              para visualizar los resultados.
            </div>
          )}

        </section>
      )}

      {/* ======================================
          REPORTE GENERAL
      ====================================== */}

      {activeCategory === 'general' && (
        <section className="reports-general-section">

          <button
            type="button"
            className="reports-back-button"
            onClick={handleBack}
          >
            <ArrowLeft size={19} strokeWidth={1.8} />
            Volver a categorías
          </button>

          <GeneralReportsFilters
            startDate={generalStartDate}
            endDate={generalEndDate}
            onStartDateChange={setGeneralStartDate}
            onEndDateChange={setGeneralEndDate}
            onClearFilters={clearGeneralFilters}
          />

          {generalFiltersValid ? (
            <>
              <GeneralReportsPreview
                summary={generalSummary}
                loading={generalLoading}
                error={patientsError}
              />

              <ReportExportActions
                category="general"
                reportTitle="Reporte general de la clínica"
                summary={generalSummary}
                startDate={generalStartDate}
                endDate={generalEndDate}
                disabled={
                  generalLoading ||
                  Boolean(patientsError) ||
                  !generalSummary
                }
              />
            </>
          ) : (
            <div
              className="appointment-reports-date-error"
              role="alert"
            >
              La fecha inicial no puede ser posterior
              a la fecha final.
            </div>
          )}

        </section>
      )}

    </div>
  )
}

export default Reports