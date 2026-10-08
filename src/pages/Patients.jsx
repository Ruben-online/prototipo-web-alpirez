import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatients } from '../context/PatientsContext'
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

import '../styles/patients.css'
import '../styles/patients-form-modal.css'
import '../styles/patients-status-modal.css'

// ==========================================
// CONSTANTES
// ==========================================

const filters = ['Todos', 'Activos', 'Inactivos']

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

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

function getToday() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function Patients() {
  const navigate = useNavigate()

  // ==========================================
  // DATOS COMPARTIDOS
  // ==========================================

  const {
    patients,
    addPatient,
    updatePatient,
    updatePatientStatus,
  } = usePatients()

  // ==========================================
  // ESTADOS DE LA INTERFAZ
  // ==========================================

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)

  // Modal de registro y edición
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPatientId, setEditingPatientId] = useState(null)

  // Modal de confirmación de estado
  const [patientToToggle, setPatientToToggle] = useState(null)

  // Formulario
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  // Mensaje de éxito
  const [successMessage, setSuccessMessage] = useState('')

  const patientsPerPage = 5
  const isEditing = editingPatientId !== null

  // ==========================================
  // FILTROS Y BÚSQUEDA
  // ==========================================

  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(normalizedSearch) ||
        patient.email.toLowerCase().includes(normalizedSearch) ||
        patient.phone.includes(normalizedSearch)

      const matchesFilter =
        activeFilter === 'Todos' ||
        (activeFilter === 'Activos' && patient.status === 'Activo') ||
        (activeFilter === 'Inactivos' && patient.status === 'Inactivo')

      return matchesSearch && matchesFilter
    })
  }, [patients, search, activeFilter])

  // ==========================================
  // PAGINACIÓN
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPatients.length / patientsPerPage)
  )

  const safeCurrentPage = Math.min(currentPage, totalPages)

  const visiblePatients = filteredPatients.slice(
    (safeCurrentPage - 1) * patientsPerPage,
    safeCurrentPage * patientsPerPage
  )

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  const activePatients = patients.filter(
    (patient) => patient.status === 'Activo'
  ).length

  const activePercentage = patients.length
    ? Math.round((activePatients / patients.length) * 100)
    : 0

  // ==========================================
  // EFECTOS DE LOS MODALES
  // ==========================================

  useEffect(() => {
    if (!modalOpen && !patientToToggle) return

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (patientToToggle) {
          setPatientToToggle(null)
        } else {
          setModalOpen(false)
          setEditingPatientId(null)
          setFormError('')
        }
      }
    }

    document.addEventListener('keydown', handleEscape)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [modalOpen, patientToToggle])

  // ==========================================
  // MENSAJE DE CONFIRMACIÓN
  // ==========================================

  useEffect(() => {
    if (!successMessage) return

    const timeout = setTimeout(() => {
      setSuccessMessage('')
    }, 4000)

    return () => clearTimeout(timeout)
  }, [successMessage])

  // ==========================================
  // BUSCADOR Y FILTROS
  // ==========================================

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setCurrentPage(1)
  }

  const handleFilter = (filter) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  // ==========================================
  // NAVEGACIÓN AL EXPEDIENTE
  // ==========================================

  const handleViewPatient = (patientId) => {
    navigate(`/dashboard/pacientes/${patientId}`)
  }

  // ==========================================
  // ACTIVAR / DESACTIVAR PACIENTE
  // ==========================================

  const handleTogglePatientStatus = (patient) => {
    setPatientToToggle(patient)
  }

  const closeStatusModal = () => {
    setPatientToToggle(null)
  }

  const confirmTogglePatientStatus = () => {
    if (!patientToToggle) return

    const isActive = patientToToggle.status === 'Activo'
    const newStatus = isActive ? 'Inactivo' : 'Activo'

    updatePatientStatus(patientToToggle.id, newStatus)

    setSuccessMessage(
      `${patientToToggle.name} fue ${
        isActive ? 'desactivado' : 'activado'
      } correctamente.`
    )

    closeStatusModal()
  }

  // ==========================================
  // REGISTRAR PACIENTE
  // ==========================================

  const openCreateModal = () => {
    setEditingPatientId(null)
    setForm({ ...emptyForm })
    setFormError('')
    setModalOpen(true)
  }

  // ==========================================
  // EDITAR PACIENTE
  // ==========================================

  const openEditModal = (patient) => {
    setEditingPatientId(patient.id)

    setForm({
      name: patient.name,
      birthDate: patient.birthDate || '',
      sex: patient.sex || '',
      phone: patient.phone,
      email: patient.email,
      address: patient.address || '',
    })

    setFormError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingPatientId(null)
    setFormError('')
  }

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

  // ==========================================
  // GUARDAR PACIENTE
  // ==========================================

  const handleSubmit = (event) => {
    event.preventDefault()

    const name = form.name.trim()
    const phone = form.phone.trim()
    const email = form.email.trim().toLowerCase()

    if (!name || !form.birthDate || !form.sex || !phone || !email) {
      setFormError('Completa todos los campos obligatorios.')
      return
    }

    if (name.length < 3) {
      setFormError('Ingresa un nombre completo válido.')
      return
    }

    if (form.birthDate > getToday()) {
      setFormError('La fecha de nacimiento no puede ser futura.')
      return
    }

    if (!/^[0-9+\s()-]{8,20}$/.test(phone)) {
      setFormError('Ingresa un número de teléfono válido.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Ingresa un correo electrónico válido.')
      return
    }

    const duplicateEmail = patients.some(
      (patient) =>
        patient.email.toLowerCase() === email &&
        patient.id !== editingPatientId
    )

    if (duplicateEmail) {
      setFormError(
        'Ya existe un paciente con este correo electrónico.'
      )
      return
    }

    // ==========================================
    // ACTUALIZAR PACIENTE
    // ==========================================

    if (isEditing) {
      updatePatient(editingPatientId, {
        name,
        initials: getInitials(name),
        email,
        phone,
        birthDate: form.birthDate,
        sex: form.sex,
        address: form.address.trim(),
      })

      setSuccessMessage(
        `La información de ${name} fue actualizada correctamente.`
      )
    } else {
      // ==========================================
      // REGISTRAR PACIENTE
      // ==========================================

      const newPatient = {
        id: Math.max(0, ...patients.map((patient) => patient.id)) + 1,
        name,
        initials: getInitials(name),
        email,
        phone,
        birthDate: form.birthDate,
        sex: form.sex,
        address: form.address.trim(),
        lastVisit: 'Sin consultas',
        status: 'Activo',
        consultations: 0,
      }

      addPatient(newPatient)

      setSearch('')
      setActiveFilter('Todos')
      setCurrentPage(1)

      setSuccessMessage(
        `${name} fue registrado correctamente.`
      )
    }

    closeModal()
    setForm({ ...emptyForm })
  }

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <div className="patients-page">

      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <section className="patients-heading">

        <div>
          <span className="dashboard-section-eyebrow">
            GESTIÓN DE PACIENTES
          </span>

          <h2>Directorio de pacientes</h2>

          <p>
            Consulta y administra la información de tus pacientes
            desde un solo lugar.
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

      {/* ==========================================
          MENSAJE DE CONFIRMACIÓN
      ========================================== */}

      {successMessage && (
        <div className="patients-success" role="status">

          <UserRoundCheck size={18} strokeWidth={1.8} />

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

      {/* ==========================================
          ESTADÍSTICAS
      ========================================== */}

      <section className="patients-stats">

        <article className="patients-stat-card">

          <div className="patients-stat-icon">
            <UsersRound size={21} strokeWidth={1.8} />
          </div>

          <div className="patients-stat-info">
            <span>Total de pacientes</span>
            <strong>{patients.length}</strong>
            <small>Pacientes de demostración</small>
          </div>

          <span className="patients-stat-decoration">
            <ArrowUpRight size={17} />
          </span>

        </article>

        <article className="patients-stat-card">

          <div className="patients-stat-icon">
            <UserRoundCheck size={21} strokeWidth={1.8} />
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

        <article className="patients-stat-card">

          <div className="patients-stat-icon">
            <CalendarDays size={21} strokeWidth={1.8} />
          </div>

          <div className="patients-stat-info">
            <span>Nuevos este mes</span>
            <strong>18</strong>
            <small>Dato de demostración</small>
          </div>

          <span className="patients-stat-tag">
            +8.2%
          </span>

        </article>

      </section>

      {/* ==========================================
          DIRECTORIO
      ========================================== */}

      <section className="patients-directory">

        <div className="patients-directory-header">

          <div>
            <span className="dashboard-panel-eyebrow">
              DIRECTORIO
            </span>

            <h3>Todos los pacientes</h3>

            <p>
              Encuentra rápidamente un paciente y consulta su expediente.
            </p>
          </div>

          <span className="patients-total-badge">
            {filteredPatients.length} resultados
          </span>

        </div>

        {/* BUSCADOR Y FILTROS */}

        <div className="patients-toolbar">

          <div className="patients-search">
            <Search size={18} strokeWidth={1.8} />

            <input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          <div className="patients-filter-label">
            <SlidersHorizontal size={17} strokeWidth={1.8} />
            <span>Filtrar:</span>
          </div>

          <div className="patients-filters">

            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`patients-filter ${
                  activeFilter === filter ? 'active' : ''
                }`}
                onClick={() => handleFilter(filter)}
              >
                {filter}
              </button>
            ))}

          </div>

        </div>

        {/* ==========================================
            TABLA
        ========================================== */}

        <PatientsTable
          patients={visiblePatients}
          onViewPatient={handleViewPatient}
          onEditPatient={openEditModal}
          onTogglePatientStatus={handleTogglePatientStatus}
        />

        {/* ==========================================
            PAGINACIÓN
        ========================================== */}

        <div className="patients-pagination">

          <p>
            Mostrando{' '}
            <strong>
              {filteredPatients.length === 0
                ? 0
                : (safeCurrentPage - 1) * patientsPerPage + 1}
              -
              {Math.min(
                safeCurrentPage * patientsPerPage,
                filteredPatients.length
              )}
            </strong>{' '}
            de <strong>{filteredPatients.length}</strong> pacientes
          </p>

          <div className="patients-pagination-actions">

            <button
              type="button"
              aria-label="Página anterior"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage(safeCurrentPage - 1)}
            >
              <ChevronLeft size={17} />
            </button>

            <span>
              Página {safeCurrentPage} de {totalPages}
            </span>

            <button
              type="button"
              aria-label="Página siguiente"
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPage(safeCurrentPage + 1)}
            >
              <ChevronRight size={17} />
            </button>

          </div>

        </div>

      </section>

      {/* ==========================================
          MODAL REGISTRAR / EDITAR
      ========================================== */}

      <PatientFormModal
        isOpen={modalOpen}
        isEditing={isEditing}
        form={form}
        formError={formError}
        onClose={closeModal}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
      />

      {/* ==========================================
          MODAL ACTIVAR / DESACTIVAR PACIENTE
      ========================================== */}

      <PatientStatusModal
        patient={patientToToggle}
        onClose={closeStatusModal}
        onConfirm={confirmTogglePatientStatus}
      />

    </div>
  )
}

export default Patients