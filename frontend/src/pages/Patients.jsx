import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatients } from '../hooks/usePatients'

import PatientStatusModal from '../components/patients/PatientStatusModal'
import PatientFormModal from '../components/patients/PatientFormModal'
import PatientsTable from '../components/patients/PatientsTable'

import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
  UserRoundCheck,
  UsersRound,
  X,
} from 'lucide-react'

import '../styles/patients/patients.css'
import '../styles/patients/patients-form-modal.css'
import '../styles/patients/patients-status-modal.css'

// ==========================================
// CONSTANTES
// ==========================================

const filters = ['Todos', 'Activos', 'Inactivos']

const PATIENTS_PER_PAGE = 5

const emptyForm = {
  name: '',
  birthDate: '',
  sex: '',
  phone: '',
  email: '',
  address: '',
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function getToday() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getNewPatientsThisMonth(patients) {
  const now = new Date()

  return patients.filter((patient) => {
    if (!patient.createdAt) return false

    const createdAt = new Date(patient.createdAt)

    if (Number.isNaN(createdAt.getTime())) {
      return false
    }

    return (
      createdAt.getFullYear() === now.getFullYear() &&
      createdAt.getMonth() === now.getMonth()
    )
  }).length
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function Patients() {
  const navigate = useNavigate()

  // ========================================
  // DATOS DE SUPABASE
  // ========================================

  const {
    patients,
    loading,
    error: patientsError,
    addPatient,
    updatePatient,
    updatePatientStatus,
  } = usePatients()

  // ========================================
  // ESTADOS DE LA INTERFAZ
  // ========================================

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)

  // Modal de registro y edición
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPatientId, setEditingPatientId] = useState(null)

  // Modal de activación y desactivación
  const [patientToToggle, setPatientToToggle] = useState(null)

  // Formulario
  const [form, setForm] = useState({ ...emptyForm })
  const [formError, setFormError] = useState('')

  // Mensaje de confirmación
  const [successMessage, setSuccessMessage] = useState('')

  const isEditing = editingPatientId !== null

  // ========================================
  // BÚSQUEDA Y FILTROS
  // ========================================

  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return patients.filter((patient) => {
      const matchesSearch =
        (patient.name || '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        (patient.email || '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        (patient.phone || '')
          .includes(normalizedSearch)

      const matchesFilter =
        activeFilter === 'Todos' ||
        (activeFilter === 'Activos' &&
          patient.status === 'Activo') ||
        (activeFilter === 'Inactivos' &&
          patient.status === 'Inactivo')

      return matchesSearch && matchesFilter
    })
  }, [patients, search, activeFilter])

  // ========================================
  // PAGINACIÓN
  // ========================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE)
  )

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  )

  const visiblePatients = filteredPatients.slice(
    (safeCurrentPage - 1) * PATIENTS_PER_PAGE,
    safeCurrentPage * PATIENTS_PER_PAGE
  )

  const firstVisiblePatient =
    filteredPatients.length === 0
      ? 0
      : (safeCurrentPage - 1) * PATIENTS_PER_PAGE + 1

  const lastVisiblePatient = Math.min(
    safeCurrentPage * PATIENTS_PER_PAGE,
    filteredPatients.length
  )

  // ========================================
  // ESTADÍSTICAS REALES
  // ========================================

  const activePatients = useMemo(() => {
    return patients.filter(
      (patient) => patient.status === 'Activo'
    ).length
  }, [patients])

  const activePercentage = patients.length
    ? Math.round(
        (activePatients / patients.length) * 100
      )
    : 0

  const newPatientsThisMonth = useMemo(() => {
    return getNewPatientsThisMonth(patients)
  }, [patients])

  // ========================================
  // CIERRE DE MODALES CON ESCAPE
  // ========================================

  useEffect(() => {
    if (!modalOpen && !patientToToggle) return

    const handleEscape = (event) => {
      if (event.key !== 'Escape') return

      if (patientToToggle) {
        setPatientToToggle(null)
        return
      }

      setModalOpen(false)
      setEditingPatientId(null)
      setFormError('')
    }

    document.addEventListener('keydown', handleEscape)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      )

      document.body.style.overflow = previousOverflow
    }
  }, [modalOpen, patientToToggle])

  // ========================================
  // MENSAJES DE CONFIRMACIÓN
  // ========================================

  useEffect(() => {
    if (!successMessage) return

    const timeout = setTimeout(() => {
      setSuccessMessage('')
    }, 4000)

    return () => clearTimeout(timeout)
  }, [successMessage])

  // ========================================
  // BUSCADOR Y FILTROS
  // ========================================

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setCurrentPage(1)
  }

  const handleFilter = (filter) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  // ========================================
  // VER EXPEDIENTE
  // ========================================

  const handleViewPatient = (patientId) => {
    navigate(`/dashboard/pacientes/${patientId}`)
  }

  // ========================================
  // ACTIVAR / DESACTIVAR
  // ========================================

  const handleTogglePatientStatus = (patient) => {
    setPatientToToggle(patient)
  }

  const closeStatusModal = () => {
    setPatientToToggle(null)
  }

  const confirmTogglePatientStatus = async () => {
    if (!patientToToggle) return

    const patient = patientToToggle
    const isActive = patient.status === 'Activo'

    const newStatus = isActive
      ? 'Inactivo'
      : 'Activo'

    try {
      await updatePatientStatus(
        patient.id,
        newStatus
      )

      setSuccessMessage(
        `${patient.name} fue ${
          isActive ? 'desactivado' : 'activado'
        } correctamente.`
      )

      closeStatusModal()
    } catch (error) {
      console.error(
        'Error al actualizar el estado del paciente:',
        error
      )

      setSuccessMessage(
        'No se pudo actualizar el estado del paciente. Intenta nuevamente.'
      )
    }
  }

  // ========================================
  // ABRIR MODAL DE REGISTRO
  // ========================================

  const openCreateModal = () => {
    setEditingPatientId(null)
    setForm({ ...emptyForm })
    setFormError('')
    setModalOpen(true)
  }

  // ========================================
  // ABRIR MODAL DE EDICIÓN
  // ========================================

  const openEditModal = (patient) => {
    setEditingPatientId(patient.id)

    setForm({
      name: patient.name || '',
      birthDate: patient.birthDate || '',
      sex: patient.sex || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
    })

    setFormError('')
    setModalOpen(true)
  }

  // ========================================
  // CERRAR MODAL
  // ========================================

  const closeModal = () => {
    setModalOpen(false)
    setEditingPatientId(null)
    setFormError('')
  }

  // ========================================
  // CAMBIOS EN EL FORMULARIO
  // ========================================

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (formError) {
      setFormError('')
    }
  }

  // ========================================
  // GUARDAR PACIENTE
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    const name = form.name.trim()
    const phone = form.phone.trim()
    const email = form.email.trim().toLowerCase()

    // Validación de campos obligatorios

    if (
      !name ||
      !form.birthDate ||
      !form.sex ||
      !phone ||
      !email
    ) {
      setFormError(
        'Completa todos los campos obligatorios.'
      )
      return
    }

    // Validación del nombre

    if (name.length < 3) {
      setFormError(
        'Ingresa un nombre completo válido.'
      )
      return
    }

    // Validación de fecha de nacimiento

    if (form.birthDate > getToday()) {
      setFormError(
        'La fecha de nacimiento no puede ser futura.'
      )
      return
    }

    // Validación del teléfono

    if (!/^[0-9+\s()-]{8,20}$/.test(phone)) {
      setFormError(
        'Ingresa un número de teléfono válido.'
      )
      return
    }

    // Validación del correo

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError(
        'Ingresa un correo electrónico válido.'
      )
      return
    }

    // Validación de correo duplicado

    const duplicateEmail = patients.some(
      (patient) =>
        (patient.email || '').toLowerCase() === email &&
        patient.id !== editingPatientId
    )

    if (duplicateEmail) {
      setFormError(
        'Ya existe un paciente con este correo electrónico.'
      )
      return
    }

    // ======================================
    // CREAR O ACTUALIZAR EN SUPABASE
    // ======================================

    try {
      const patientData = {
        name,
        email,
        phone,
        birthDate: form.birthDate,
        sex: form.sex,
        address: form.address.trim(),
      }

      if (isEditing) {
        await updatePatient(
          editingPatientId,
          patientData
        )

        setSuccessMessage(
          `La información de ${name} fue actualizada correctamente.`
        )
      } else {
        await addPatient(patientData)

        setSearch('')
        setActiveFilter('Todos')
        setCurrentPage(1)

        setSuccessMessage(
          `${name} fue registrado correctamente.`
        )
      }

      closeModal()
      setForm({ ...emptyForm })
    } catch (error) {
      setFormError(
        `Error al guardar: ${error.message}`
      )
    }
  }

  // ========================================
  // ESTADO DE CARGA
  // ========================================

  if (loading) {
    return (
      <div className="patients-page">
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--color-text-light)',
          }}
          role="status"
        >
          <p>Cargando pacientes desde Supabase...</p>
        </div>
      </div>
    )
  }

  // ========================================
  // ESTADO DE ERROR
  // ========================================

  if (patientsError) {
    return (
      <div className="patients-page">
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#dc2626',
          }}
          role="alert"
        >
          <p>
            Error al cargar pacientes: {patientsError}
          </p>
        </div>
      </div>
    )
  }

  // ========================================
  // INTERFAZ PRINCIPAL
  // ========================================

  return (
    <div className="patients-page">

      {/* ====================================
          ENCABEZADO
      ==================================== */}

      <section className="patients-heading">
        <div>
          <span className="dashboard-section-eyebrow">
            GESTIÓN DE PACIENTES
          </span>

          <h2>Directorio de pacientes</h2>

          <p>
            Consulta y administra la información de tus
            pacientes desde un solo lugar.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-primary-button"
          onClick={openCreateModal}
        >
          <Plus size={18} strokeWidth={1.8} />
          <span>Nuevo paciente</span>
        </button>
      </section>

      {/* ====================================
          MENSAJE DE CONFIRMACIÓN
      ==================================== */}

      {successMessage && (
        <div
          className="patients-success"
          role="status"
        >
          <UserRoundCheck
            size={18}
            strokeWidth={1.8}
          />

          <span>{successMessage}</span>

          <button
            type="button"
            aria-label="Cerrar mensaje"
            onClick={() => setSuccessMessage('')}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ====================================
          ESTADÍSTICAS REALES
      ==================================== */}

      <section className="patients-stats">

        {/* TOTAL DE PACIENTES */}

        <article className="patients-stat-card">
          <div className="patients-stat-icon">
            <UsersRound
              size={21}
              strokeWidth={1.8}
            />
          </div>

          <div className="patients-stat-info">
            <span>Total de pacientes</span>

            <strong>{patients.length}</strong>

            <small>
              Pacientes registrados en la clínica
            </small>
          </div>

          <span className="patients-stat-decoration">
            <ArrowUpRight size={17} />
          </span>
        </article>

        {/* PACIENTES ACTIVOS */}

        <article className="patients-stat-card">
          <div className="patients-stat-icon">
            <UserRoundCheck
              size={21}
              strokeWidth={1.8}
            />
          </div>

          <div className="patients-stat-info">
            <span>Pacientes activos</span>

            <strong>{activePatients}</strong>

            <small>Con estado activo</small>
          </div>

          <span className="patients-stat-tag">
            {activePercentage}%
          </span>
        </article>

        {/* NUEVOS ESTE MES */}

        <article className="patients-stat-card">
          <div className="patients-stat-icon">
            <CalendarDays
              size={21}
              strokeWidth={1.8}
            />
          </div>

          <div className="patients-stat-info">
            <span>Nuevos este mes</span>

            <strong>{newPatientsThisMonth}</strong>

            <small>
              Registrados durante el mes actual
            </small>
          </div>
        </article>

      </section>

      {/* ====================================
          DIRECTORIO
      ==================================== */}

      <section className="patients-directory">

        {/* ENCABEZADO DEL DIRECTORIO */}

        <div className="patients-directory-header">
          <div>
            <span className="dashboard-panel-eyebrow">
              DIRECTORIO
            </span>

            <h3>Todos los pacientes</h3>

            <p>
              Encuentra rápidamente un paciente y consulta
              su expediente.
            </p>
          </div>

          <span className="patients-total-badge">
            {filteredPatients.length}{' '}
            {filteredPatients.length === 1
              ? 'resultado'
              : 'resultados'}
          </span>
        </div>

        {/* ==================================
            BUSCADOR Y FILTROS
        ================================== */}

        <div className="patients-toolbar">
          <div className="patients-search">
            <Search
              size={18}
              strokeWidth={1.8}
            />

            <input
              type="search"
              aria-label="Buscar pacientes"
              placeholder="Buscar por nombre, correo o teléfono..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          <div className="patients-filter-label">
            <SlidersHorizontal
              size={17}
              strokeWidth={1.8}
            />

            <span>Filtrar:</span>
          </div>

          <div className="patients-filters">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`patients-filter ${
                  activeFilter === filter
                    ? 'active'
                    : ''
                }`}
                aria-pressed={
                  activeFilter === filter
                }
                onClick={() => handleFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* ==================================
            TABLA / TARJETAS RESPONSIVE
        ================================== */}

        <PatientsTable
          patients={visiblePatients}
          onViewPatient={handleViewPatient}
          onEditPatient={openEditModal}
          onTogglePatientStatus={
            handleTogglePatientStatus
          }
        />

        {/* ==================================
            PAGINACIÓN
        ================================== */}

        <div className="patients-pagination">
          <p>
            Mostrando{' '}
            <strong>
              {firstVisiblePatient}-{lastVisiblePatient}
            </strong>{' '}
            de{' '}
            <strong>
              {filteredPatients.length}
            </strong>{' '}
            pacientes
          </p>

          <div className="patients-pagination-actions">
            <button
              type="button"
              aria-label="Página anterior"
              disabled={safeCurrentPage === 1}
              onClick={() =>
                setCurrentPage(safeCurrentPage - 1)
              }
            >
              <ChevronLeft size={17} />
            </button>

            <span>
              Página {safeCurrentPage} de {totalPages}
            </span>

            <button
              type="button"
              aria-label="Página siguiente"
              disabled={
                safeCurrentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(safeCurrentPage + 1)
              }
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

      </section>

      {/* ====================================
          MODAL REGISTRAR / EDITAR
      ==================================== */}

      <PatientFormModal
        isOpen={modalOpen}
        isEditing={isEditing}
        form={form}
        formError={formError}
        onClose={closeModal}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
      />

      {/* ====================================
          MODAL ACTIVAR / DESACTIVAR
      ==================================== */}

      <PatientStatusModal
        patient={patientToToggle}
        onClose={closeStatusModal}
        onConfirm={confirmTogglePatientStatus}
      />

    </div>
  )
}

export default Patients