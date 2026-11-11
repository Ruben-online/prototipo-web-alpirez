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
const emptyForm = { name: '', birthDate: '', sex: '', phone: '', email: '', address: '' }

function getToday() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Patients() {
  const navigate = useNavigate()
  const { patients, loading, error: patientsError, addPatient, updatePatient, updatePatientStatus } = usePatients()

  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPatientId, setEditingPatientId] = useState(null)
  const [patientToToggle, setPatientToToggle] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef(null) // <-- Referencia al input oculto

  const patientsPerPage = 5
  const isEditing = editingPatientId !== null

  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return patients.filter((patient) => {
      const matchesSearch = patient.name.toLowerCase().includes(normalizedSearch) || patient.email.toLowerCase().includes(normalizedSearch) || patient.phone.includes(normalizedSearch)
      const matchesFilter = activeFilter === 'Todos' || (activeFilter === 'Activos' && patient.status === 'Activo') || (activeFilter === 'Inactivos' && patient.status === 'Inactivo')
      return matchesSearch && matchesFilter
    })
  }, [patients, search, activeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / patientsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const visiblePatients = filteredPatients.slice((safeCurrentPage - 1) * patientsPerPage, safeCurrentPage * patientsPerPage)
  const activePatients = patients.filter((p) => p.status === 'Activo').length
  const activePercentage = patients.length ? Math.round((activePatients / patients.length) * 100) : 0

  useEffect(() => {
    if (!modalOpen && !patientToToggle) return
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (patientToToggle) setPatientToToggle(null)
        else { setModalOpen(false); setEditingPatientId(null); setFormError('') }
      }
    }
    document.addEventListener('keydown', handleEscape)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = previousOverflow }
  }, [modalOpen, patientToToggle])

  useEffect(() => {
    if (!successMessage) return
    const timeout = setTimeout(() => { setSuccessMessage('') }, 4000)
    return () => clearTimeout(timeout)
  }, [successMessage])

  const handleSearch = (event) => { setSearch(event.target.value); setCurrentPage(1) }
  const handleFilter = (filter) => { setActiveFilter(filter); setCurrentPage(1) }
  const handleViewPatient = (patientId) => navigate(`/dashboard/pacientes/${patientId}`)
  const handleTogglePatientStatus = (patient) => setPatientToToggle(patient)
  const closeStatusModal = () => setPatientToToggle(null)

  const confirmTogglePatientStatus = () => {
    if (!patientToToggle) return
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
  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (formError) setFormError('')
  }

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    const name = form.name.trim(); const phone = form.phone.trim(); const email = form.email.trim().toLowerCase()

    if (!name || !form.birthDate || !form.sex || !phone || !email) { setFormError('Completa todos los campos obligatorios.'); return }
    if (name.length < 3) { setFormError('Ingresa un nombre completo válido.'); return }
    if (form.birthDate > getToday()) { setFormError('La fecha de nacimiento no puede ser futura.'); return }
    if (!/^[0-9+\s()-]{8,20}$/.test(phone)) { setFormError('Ingresa un número de teléfono válido.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFormError('Ingresa un correo electrónico válido.'); return }

    const duplicateEmail = patients.some((p) => p.email.toLowerCase() === email && p.id !== editingPatientId)
    if (duplicateEmail) { setFormError('Ya existe un paciente con este correo electrónico.'); return }

    try {
      if (isEditing) {
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
      <section className="patients-heading">
        <div>
          <span className="dashboard-section-eyebrow">GESTIÓN DE PACIENTES</span>
          <h2>Directorio de pacientes</h2>
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
        </article>
      </section>

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
            ))}
          </div>
        </div>

        <PatientsTable patients={visiblePatients} onViewPatient={handleViewPatient} onEditPatient={openEditModal} onTogglePatientStatus={handleTogglePatientStatus} />

        <div className="patients-pagination">
          <p>Mostrando <strong>{filteredPatients.length === 0 ? 0 : (safeCurrentPage - 1) * patientsPerPage + 1}-{Math.min(safeCurrentPage * patientsPerPage, filteredPatients.length)}</strong> de <strong>{filteredPatients.length}</strong> pacientes</p>
          <div className="patients-pagination-actions">
            <button type="button" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage(safeCurrentPage - 1)}><ChevronLeft size={17} /></button>
            <span>Página {safeCurrentPage} de {totalPages}</span>
            <button type="button" disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage(safeCurrentPage + 1)}><ChevronRight size={17} /></button>
          </div>
        </div>
      </section>

      <PatientFormModal isOpen={modalOpen} isEditing={isEditing} form={form} formError={formError} onClose={closeModal} onChange={handleFormChange} onSubmit={handleSubmit} />
      <PatientStatusModal patient={patientToToggle} onClose={closeStatusModal} onConfirm={confirmTogglePatientStatus} />
    </div>
  )
}

export default Patients