import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatients } from '../context/PatientsContext'

import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  UserRoundCheck,
  UserRoundX,
  UsersRound,
  X,
} from 'lucide-react'

import '../styles/patients.css'

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

        <div className="patients-table-wrapper">

          <table className="patients-table">

            <thead>
              <tr>
                <th>PACIENTE</th>
                <th>CONTACTO</th>
                <th>ÚLTIMA CONSULTA</th>
                <th>CONSULTAS</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>

              {visiblePatients.map((patient) => (
                <tr key={patient.id}>

                  {/* PACIENTE */}

                  <td>
                    <div className="patients-person">

                      <div className="patients-avatar">
                        {patient.initials}
                      </div>

                      <div className="patients-person-info">
                        <strong>{patient.name}</strong>

                        <span>
                          ID #{String(patient.id).padStart(4, '0')}
                        </span>
                      </div>

                    </div>
                  </td>

                  {/* CONTACTO */}

                  <td>
                    <div className="patients-contact">
                      <span>{patient.email}</span>
                      <small>{patient.phone}</small>
                    </div>
                  </td>

                  {/* ÚLTIMA CONSULTA */}

                  <td>
                    <div className="patients-date">
                      <Clock3 size={15} strokeWidth={1.8} />
                      <span>{patient.lastVisit}</span>
                    </div>
                  </td>

                  {/* CONSULTAS */}

                  <td>
                    <span className="patients-consultations">
                      {patient.consultations}
                    </span>
                  </td>

                  {/* ESTADO */}

                  <td>
                    <span
                      className={`patients-status ${
                        patient.status === 'Activo'
                          ? 'active'
                          : 'inactive'
                      }`}
                    >
                      <span className="patients-status-dot" />
                      {patient.status}
                    </span>
                  </td>

                  {/* ==========================================
                      ACCIONES
                  ========================================== */}

                  <td>
                    <div className="patients-row-actions">

                      {/* VER EXPEDIENTE */}

                      <button
                        type="button"
                        className="patients-view-button"
                        title={`Ver expediente de ${patient.name}`}
                        onClick={() => handleViewPatient(patient.id)}
                      >
                        <FileText size={16} strokeWidth={1.8} />
                        <span>Ver expediente</span>
                      </button>

                      {/* EDITAR PACIENTE */}

                      <button
                        type="button"
                        className="patients-edit-button"
                        title={`Editar a ${patient.name}`}
                        aria-label={`Editar a ${patient.name}`}
                        onClick={() => openEditModal(patient)}
                      >
                        <Pencil size={15} strokeWidth={1.8} />
                      </button>

                      {/* ACTIVAR / DESACTIVAR PACIENTE */}

                      <button
                        type="button"
                        className={`patients-toggle-button ${
                          patient.status === 'Activo'
                            ? 'deactivate'
                            : 'activate'
                        }`}
                        title={
                          patient.status === 'Activo'
                            ? `Desactivar a ${patient.name}`
                            : `Activar a ${patient.name}`
                        }
                        aria-label={
                          patient.status === 'Activo'
                            ? `Desactivar a ${patient.name}`
                            : `Activar a ${patient.name}`
                        }
                        onClick={() =>
                          handleTogglePatientStatus(patient)
                        }
                      >
                        {patient.status === 'Activo' ? (
                          <UserRoundX size={16} strokeWidth={1.8} />
                        ) : (
                          <UserRoundCheck size={16} strokeWidth={1.8} />
                        )}
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {/* SIN RESULTADOS */}

              {visiblePatients.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="patients-empty">
                      <Search size={27} strokeWidth={1.5} />

                      <strong>No encontramos pacientes</strong>

                      <p>
                        Prueba con otro nombre o cambia los filtros.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

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

      {modalOpen && (
        <div
          className="patients-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal()
            }
          }}
        >
          <div
            className="patients-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="patients-modal-title"
          >

            {/* ENCABEZADO DEL MODAL */}

            <div className="patients-modal-header">

              <div className="patients-modal-heading">

                <div className="patients-modal-icon">
                  {isEditing ? (
                    <Pencil size={21} strokeWidth={1.8} />
                  ) : (
                    <UsersRound size={21} strokeWidth={1.8} />
                  )}
                </div>

                <div>
                  <span className="dashboard-section-eyebrow">
                    GESTIÓN DE PACIENTES
                  </span>

                  <h3 id="patients-modal-title">
                    {isEditing
                      ? 'Editar paciente'
                      : 'Registrar nuevo paciente'}
                  </h3>

                  <p>
                    {isEditing
                      ? 'Actualiza la información del paciente.'
                      : 'Completa los datos para crear su expediente.'}
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="patients-modal-close"
                aria-label="Cerrar formulario"
                onClick={closeModal}
              >
                <X size={20} />
              </button>

            </div>

            {/* FORMULARIO */}

            <form onSubmit={handleSubmit}>

              <div className="patients-modal-body">

                <div className="patients-form-section">
                  <span>INFORMACIÓN PERSONAL</span>

                  <p>
                    Los campos marcados con * son obligatorios.
                  </p>
                </div>

                <div className="patients-form-grid">

                  {/* NOMBRE */}

                  <div className="patients-form-field patients-form-full">
                    <label htmlFor="patient-name">
                      Nombre completo *
                    </label>

                    <input
                      id="patient-name"
                      name="name"
                      type="text"
                      placeholder="Ej. María Fernanda González"
                      value={form.name}
                      onChange={handleFormChange}
                      maxLength={100}
                      autoFocus
                      required
                    />
                  </div>

                  {/* FECHA DE NACIMIENTO */}

                  <div className="patients-form-field">
                    <label htmlFor="patient-birthdate">
                      Fecha de nacimiento *
                    </label>

                    <input
                      id="patient-birthdate"
                      name="birthDate"
                      type="date"
                      value={form.birthDate}
                      onChange={handleFormChange}
                      max={getToday()}
                      required
                    />
                  </div>

                  {/* SEXO */}

                  <div className="patients-form-field">
                    <label htmlFor="patient-sex">
                      Sexo *
                    </label>

                    <select
                      id="patient-sex"
                      name="sex"
                      value={form.sex}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiere no indicar">
                        Prefiere no indicar
                      </option>
                    </select>
                  </div>

                  {/* TELÉFONO */}

                  <div className="patients-form-field">
                    <label htmlFor="patient-phone">
                      Teléfono *
                    </label>

                    <input
                      id="patient-phone"
                      name="phone"
                      type="tel"
                      placeholder="Ej. 5555-1234"
                      value={form.phone}
                      onChange={handleFormChange}
                      maxLength={20}
                      required
                    />
                  </div>

                  {/* CORREO */}

                  <div className="patients-form-field">
                    <label htmlFor="patient-email">
                      Correo electrónico *
                    </label>

                    <input
                      id="patient-email"
                      name="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={form.email}
                      onChange={handleFormChange}
                      maxLength={120}
                      required
                    />
                  </div>

                  {/* DIRECCIÓN */}

                  <div className="patients-form-field patients-form-full">
                    <label htmlFor="patient-address">
                      Dirección
                    </label>

                    <textarea
                      id="patient-address"
                      name="address"
                      rows="3"
                      placeholder="Ej. Ciudad de Guatemala, zona 10"
                      value={form.address}
                      onChange={handleFormChange}
                      maxLength={250}
                    />
                  </div>

                </div>

                {/* ERROR */}

                {formError && (
                  <div className="patients-form-error" role="alert">
                    {formError}
                  </div>
                )}

                {/* NOTA */}

                <div className="patients-form-note">
                  Este formulario es de demostración. Los cambios
                  no se guardarán al recargar la página.
                </div>

              </div>

              {/* BOTONES DEL MODAL */}

              <div className="patients-modal-footer">

                <button
                  type="button"
                  className="patients-cancel-button"
                  onClick={closeModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="dashboard-primary-button"
                >
                  {isEditing ? (
                    <>
                      <Pencil size={17} strokeWidth={1.8} />
                      Guardar cambios
                    </>
                  ) : (
                    <>
                      <Plus size={17} strokeWidth={1.8} />
                      Registrar paciente
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==========================================
          MODAL ACTIVAR / DESACTIVAR PACIENTE
      ========================================== */}

      {patientToToggle && (
        <div
          className="patients-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeStatusModal()
            }
          }}
        >
          <div
            className="patients-status-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="patients-status-modal-title"
            aria-describedby="patients-status-modal-description"
          >

            {/* ENCABEZADO */}

            <div className="patients-status-modal-header">

              <div
                className={`patients-status-modal-icon ${
                  patientToToggle.status === 'Activo'
                    ? 'deactivate'
                    : 'activate'
                }`}
              >
                {patientToToggle.status === 'Activo' ? (
                  <AlertTriangle size={25} strokeWidth={1.8} />
                ) : (
                  <CheckCircle2 size={25} strokeWidth={1.8} />
                )}
              </div>

              <button
                type="button"
                className="patients-modal-close"
                onClick={closeStatusModal}
                aria-label="Cerrar confirmación"
              >
                <X size={19} />
              </button>

            </div>

            {/* CONTENIDO */}

            <div className="patients-status-modal-content">

              <span className="dashboard-section-eyebrow">
                GESTIÓN DE PACIENTES
              </span>

              <h3 id="patients-status-modal-title">
                {patientToToggle.status === 'Activo'
                  ? '¿Desactivar paciente?'
                  : '¿Activar paciente?'}
              </h3>

              <p id="patients-status-modal-description">
                {patientToToggle.status === 'Activo'
                  ? 'El paciente pasará a estado inactivo y dejará de aparecer en el filtro de pacientes activos.'
                  : 'El paciente volverá a estar activo y aparecerá nuevamente en el filtro de pacientes activos.'}
              </p>

              {/* INFORMACIÓN DEL PACIENTE */}

              <div className="patients-status-modal-patient">

                <div className="patients-status-modal-avatar">
                  {patientToToggle.initials}
                </div>

                <div className="patients-status-modal-patient-info">
                  <strong>{patientToToggle.name}</strong>

                  <span>
                    ID #{String(patientToToggle.id).padStart(4, '0')}
                  </span>
                </div>

                <span
                  className={`patients-status ${
                    patientToToggle.status === 'Activo'
                      ? 'active'
                      : 'inactive'
                  }`}
                >
                  <span className="patients-status-dot" />
                  {patientToToggle.status}
                </span>

              </div>

              {/* NOTA INFORMATIVA */}

              <div className="patients-status-modal-note">
                <FileText size={18} strokeWidth={1.8} />

                <p>
                  Su expediente clínico, antecedentes médicos e
                  historial de consultas permanecerán intactos.
                  Podrás cambiar su estado nuevamente cuando lo necesites.
                </p>
              </div>

            </div>

            {/* BOTONES */}

            <div className="patients-status-modal-footer">

              <button
                type="button"
                className="patients-cancel-button"
                onClick={closeStatusModal}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={`patients-status-confirm-button ${
                  patientToToggle.status === 'Activo'
                    ? 'deactivate'
                    : 'activate'
                }`}
                onClick={confirmTogglePatientStatus}
              >
                {patientToToggle.status === 'Activo' ? (
                  <>
                    <UserRoundX size={17} strokeWidth={1.8} />
                    Sí, desactivar
                  </>
                ) : (
                  <>
                    <UserRoundCheck size={17} strokeWidth={1.8} />
                    Sí, activar
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Patients