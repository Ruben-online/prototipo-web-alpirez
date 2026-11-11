import { useEffect, useMemo, useState, useRef } from 'react'
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
  Upload // <-- Ícono nuevo
} from 'lucide-react'

import '../styles/patients/patients.css'
import '../styles/patients/patients-form-modal.css'
import '../styles/patients/patients-status-modal.css'

const filters = ['Todos', 'Activos', 'Inactivos']
<<<<<<< HEAD
const emptyForm = { name: '', birthDate: '', sex: '', phone: '', email: '', address: '' }
=======

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
>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b

function getToday() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

<<<<<<< HEAD
function Patients() {
  const navigate = useNavigate()
  const { patients, loading, error: patientsError, addPatient, updatePatient, updatePatientStatus } = usePatients()
=======
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
>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPatientId, setEditingPatientId] = useState(null)
<<<<<<< HEAD
  const [patientToToggle, setPatientToToggle] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
=======

  // Modal de activación y desactivación
  const [patientToToggle, setPatientToToggle] = useState(null)

  // Formulario
  const [form, setForm] = useState({ ...emptyForm })
  const [formError, setFormError] = useState('')

  // Mensaje de confirmación
>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
  const [successMessage, setSuccessMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef(null) // <-- Referencia al input oculto

  const isEditing = editingPatientId !== null

<<<<<<< HEAD
=======
  // ========================================
  // BÚSQUEDA Y FILTROS
  // ========================================

>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return patients.filter((patient) => {
<<<<<<< HEAD
      const matchesSearch = patient.name.toLowerCase().includes(normalizedSearch) || patient.email.toLowerCase().includes(normalizedSearch) || patient.phone.includes(normalizedSearch)
      const matchesFilter = activeFilter === 'Todos' || (activeFilter === 'Activos' && patient.status === 'Activo') || (activeFilter === 'Inactivos' && patient.status === 'Inactivo')
=======
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

>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
      return matchesSearch && matchesFilter
    })
  }, [patients, search, activeFilter])

<<<<<<< HEAD
  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / patientsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const visiblePatients = filteredPatients.slice((safeCurrentPage - 1) * patientsPerPage, safeCurrentPage * patientsPerPage)
  const activePatients = patients.filter((p) => p.status === 'Activo').length
  const activePercentage = patients.length ? Math.round((activePatients / patients.length) * 100) : 0
=======
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
>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b

  useEffect(() => {
    if (!modalOpen && !patientToToggle) return
    const handleEscape = (event) => {
<<<<<<< HEAD
      if (event.key === 'Escape') {
        if (patientToToggle) setPatientToToggle(null)
        else { setModalOpen(false); setEditingPatientId(null); setFormError('') }
=======
      if (event.key !== 'Escape') return

      if (patientToToggle) {
        setPatientToToggle(null)
        return
>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
      }

      setModalOpen(false)
      setEditingPatientId(null)
      setFormError('')
    }
    document.addEventListener('keydown', handleEscape)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
<<<<<<< HEAD
    return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = previousOverflow }
  }, [modalOpen, patientToToggle])

=======

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

>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
  useEffect(() => {
    if (!successMessage) return
    const timeout = setTimeout(() => { setSuccessMessage('') }, 4000)
    return () => clearTimeout(timeout)
  }, [successMessage])

<<<<<<< HEAD
  const handleSearch = (event) => { setSearch(event.target.value); setCurrentPage(1) }
  const handleFilter = (filter) => { setActiveFilter(filter); setCurrentPage(1) }
  const handleViewPatient = (patientId) => navigate(`/dashboard/pacientes/${patientId}`)
  const handleTogglePatientStatus = (patient) => setPatientToToggle(patient)
  const closeStatusModal = () => setPatientToToggle(null)
=======
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
>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b

  const confirmTogglePatientStatus = async () => {
    if (!patientToToggle) return
<<<<<<< HEAD
    const isActive = patientToToggle.status === 'Activo'
    updatePatientStatus(patientToToggle.id, isActive ? 'Inactivo' : 'Activo')
    setSuccessMessage(`${patientToToggle.name} fue ${isActive ? 'desactivado' : 'activado'} correctamente.`)
    closeStatusModal()
  }

  const openCreateModal = () => { setEditingPatientId(null); setForm({ ...emptyForm }); setFormError(''); setModalOpen(true) }
  const openEditModal = (patient) => {
    setEditingPatientId(patient.id)
    setForm({ name: patient.name, birthDate: patient.birthDate || '', sex: patient.sex || '', phone: patient.phone, email: patient.email, address: patient.address || '' })
    setFormError(''); setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditingPatientId(null); setFormError('') }
=======

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

>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (formError) setFormError('')
  }

<<<<<<< HEAD
  // ==========================================
  // CARGA MASIVA DE EXCEL
  // ==========================================
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    setIsUploading(true)

    try {
      const response = await fetch('http://localhost:3000/api/patients/import', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()
      
      if (result.errors?.length > 0) {
        console.warn('Errores de importación:', result.errors)
        alert(`Se importaron ${result.success} pacientes. Hubo ${result.errors.length} errores. Revisa la consola para más detalles.`)
      } else {
        alert(`¡Se importaron ${result.success} pacientes exitosamente!`)
      }
      // Recargamos la página para traer los datos frescos de Supabase
      window.location.reload()
    } catch (error) {
      alert('Error de red al subir el archivo Excel.')
    } finally {
      setIsUploading(false)
      event.target.value = null
    }
  }

=======
  // ========================================
  // GUARDAR PACIENTE
  // ========================================

>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
  const handleSubmit = async (event) => {
    event.preventDefault()
    const name = form.name.trim(); const phone = form.phone.trim(); const email = form.email.trim().toLowerCase()

    if (!name || !form.birthDate || !form.sex || !phone || !email) { setFormError('Completa todos los campos obligatorios.'); return }
    if (name.length < 3) { setFormError('Ingresa un nombre completo válido.'); return }
    if (form.birthDate > getToday()) { setFormError('La fecha de nacimiento no puede ser futura.'); return }
    if (!/^[0-9+\s()-]{8,20}$/.test(phone)) { setFormError('Ingresa un número de teléfono válido.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFormError('Ingresa un correo electrónico válido.'); return }

<<<<<<< HEAD
    const duplicateEmail = patients.some((p) => p.email.toLowerCase() === email && p.id !== editingPatientId)
    if (duplicateEmail) { setFormError('Ya existe un paciente con este correo electrónico.'); return }
=======
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
>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b

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
<<<<<<< HEAD
        await updatePatient(editingPatientId, { name, email, phone, birthDate: form.birthDate, sex: form.sex, address: form.address.trim() })
        setSuccessMessage(`La información de ${name} fue actualizada correctamente.`)
      } else {
        await addPatient({ name, email, phone, birthDate: form.birthDate, sex: form.sex, address: form.address.trim() })
        setSearch(''); setActiveFilter('Todos'); setCurrentPage(1)
        setSuccessMessage(`${name} fue registrado correctamente.`)
      }
      closeModal(); setForm({ ...emptyForm })
    } catch (err) {
      setFormError('Error al guardar: ' + err.message)
    }
  }

  if (loading) return <div className="patients-page"><div style={{ padding: '3rem', textAlign: 'center' }}><p>Cargando datos desde Supabase...</p></div></div>
  if (patientsError) return <div className="patients-page"><div style={{ padding: '3rem', textAlign: 'center', color: '#dc2626' }}><p>Error al cargar pacientes: {patientsError}</p></div></div>

  return (
    <div className="patients-page">
=======
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

>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
      <section className="patients-heading">
        <div>
          <span className="dashboard-section-eyebrow">GESTIÓN DE PACIENTES</span>
          <h2>Directorio de pacientes</h2>
<<<<<<< HEAD
          <p>Consulta y administra la información de tus pacientes desde un solo lugar.</p>
        </div>

        {/* GRUPO DE BOTONES */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
          />
          <button 
            type="button" 
            className="dashboard-secondary-button" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
          >
            <Upload size={18} strokeWidth={1.8} />
            <span>{isUploading ? 'Subiendo...' : 'Importar Excel'}</span>
          </button>

          <button type="button" className="dashboard-primary-button" onClick={openCreateModal}>
            <Plus size={18} strokeWidth={1.8} />
            <span>Nuevo paciente</span>
          </button>
        </div>
      </section>

      {successMessage && (
        <div className="patients-success" role="status">
          <UserRoundCheck size={18} strokeWidth={1.8} />
          <span>{successMessage}</span>
          <button type="button" onClick={() => setSuccessMessage('')}><X size={16} /></button>
        </div>
      )}

      <section className="patients-stats">
        <article className="patients-stat-card">
          <div className="patients-stat-icon"><UsersRound size={21} strokeWidth={1.8} /></div>
          <div className="patients-stat-info"><span>Total de pacientes</span><strong>{patients.length}</strong><small>Pacientes de demostración</small></div>
          <span className="patients-stat-decoration"><ArrowUpRight size={17} /></span>
        </article>
        <article className="patients-stat-card">
          <div className="patients-stat-icon"><UserRoundCheck size={21} strokeWidth={1.8} /></div>
          <div className="patients-stat-info"><span>Pacientes activos</span><strong>{activePatients}</strong><small>Con estado activo</small></div>
          <span className="patients-stat-tag">{activePercentage}%</span>
        </article>
        <article className="patients-stat-card">
          <div className="patients-stat-icon"><CalendarDays size={21} strokeWidth={1.8} /></div>
          <div className="patients-stat-info"><span>Nuevos este mes</span><strong>18</strong><small>Dato de demostración</small></div>
          <span className="patients-stat-tag">+8.2%</span>
=======

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
>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
        </article>
      </section>

<<<<<<< HEAD
      <section className="patients-directory">
        <div className="patients-directory-header">
          <div><span className="dashboard-panel-eyebrow">DIRECTORIO</span><h3>Todos los pacientes</h3><p>Encuentra rápidamente un paciente y consulta su expediente.</p></div>
          <span className="patients-total-badge">{filteredPatients.length} resultados</span>
        </div>

        <div className="patients-toolbar">
          <div className="patients-search">
            <Search size={18} strokeWidth={1.8} />
            <input type="text" placeholder="Buscar por nombre, correo o teléfono..." value={search} onChange={handleSearch} />
          </div>
          <div className="patients-filter-label"><SlidersHorizontal size={17} strokeWidth={1.8} /><span>Filtrar:</span></div>
          <div className="patients-filters">
            {filters.map((filter) => (
              <button key={filter} type="button" className={`patients-filter ${activeFilter === filter ? 'active' : ''}`} onClick={() => handleFilter(filter)}>{filter}</button>
=======
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
>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
            ))}
          </div>
        </div>

<<<<<<< HEAD
        <PatientsTable patients={visiblePatients} onViewPatient={handleViewPatient} onEditPatient={openEditModal} onTogglePatientStatus={handleTogglePatientStatus} />

        <div className="patients-pagination">
          <p>Mostrando <strong>{filteredPatients.length === 0 ? 0 : (safeCurrentPage - 1) * patientsPerPage + 1}-{Math.min(safeCurrentPage * patientsPerPage, filteredPatients.length)}</strong> de <strong>{filteredPatients.length}</strong> pacientes</p>
          <div className="patients-pagination-actions">
            <button type="button" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage(safeCurrentPage - 1)}><ChevronLeft size={17} /></button>
            <span>Página {safeCurrentPage} de {totalPages}</span>
            <button type="button" disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage(safeCurrentPage + 1)}><ChevronRight size={17} /></button>
=======
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
>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <PatientFormModal isOpen={modalOpen} isEditing={isEditing} form={form} formError={formError} onClose={closeModal} onChange={handleFormChange} onSubmit={handleSubmit} />
      <PatientStatusModal patient={patientToToggle} onClose={closeStatusModal} onConfirm={confirmTogglePatientStatus} />
=======
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

>>>>>>> 472e1e44bc8586405e45f82967bb32b5cf26146b
    </div>
  )
}

export default Patients