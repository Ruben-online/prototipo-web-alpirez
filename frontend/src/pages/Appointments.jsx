import { useEffect, useState } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock3,
  UserRound,
  Eye,
  Ban, // <-- Ícono para bloquear
  Unlock
} from 'lucide-react'

import { usePatients } from '../hooks/usePatients'
import { useAppointments } from '../hooks/useAppointments'

import AppointmentFormModal from '../components/appointments/AppointmentFormModal'
import AppointmentDetailsModal from '../components/appointments/AppointmentDetailsModal'

import '../styles/appointments/appointments.css'

const formatDate = (date, options) =>
  new Intl.DateTimeFormat('es-GT', options).format(date)

function addDays(date, amount) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

function getWeekStart(date) {
  const result = new Date(date)
  const day = result.getDay()
  result.setDate(result.getDate() + (day === 0 ? -6 : 1 - day))
  return result
}

function isSameDay(first, second) {
  return first.toDateString() === second.toDateString()
}

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateKey(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const statusClasses = {
  Confirmada: 'confirmed',
  Completada: 'completed',
  Cancelada: 'cancelled',
  'No asistió': 'missed',
}

function Appointments() {
  const { patients } = usePatients()
  const { 
    appointments, 
    getAppointmentsByDate,
    blockedDays = [],        // <-- Leemos los días bloqueados
    toggleBlockDate,        // <-- Función para bloquear/desbloquear día
    blockWeek               // <-- Función para bloquear la semana
  } = useAppointments()

  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [view, setView] = useState('week')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
  const [editingAppointmentId, setEditingAppointmentId] = useState(null)

  const today = new Date()
  const weekStart = getWeekStart(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
  const selectedDateKey = formatDateKey(selectedDate)
  
  // Saber si la fecha seleccionada está bloqueada
  const isSelectedDateBlocked = blockedDays.includes(selectedDateKey)

  const dailyAppointments = getAppointmentsByDate(selectedDateKey).filter(
    (appointment) => appointment.status !== 'Cancelada'
  )

  const getAppointmentsCount = (date) => {
    const dateKey = formatDateKey(date)
    return appointments.filter(
      (appointment) => appointment.date === dateKey && appointment.status !== 'Cancelada'
    ).length
  }

  const selectedAppointment = appointments.find(
    (appointment) => String(appointment.id) === String(selectedAppointmentId)
  )

  const selectedPatient = selectedAppointment
    ? patients.find((patient) => String(patient.id) === String(selectedAppointment.patientId))
    : null

  const editingAppointment = appointments.find(
    (appointment) => String(appointment.id) === String(editingAppointmentId)
  )

  const changeDate = (direction) => {
    setSelectedDate((current) => addDays(current, direction * (view === 'week' ? 7 : 1)))
  }

  const goToToday = () => setSelectedDate(new Date())
  const selectDate = (date) => setSelectedDate(date)

  const openCreateModal = () => {
    if (isSelectedDateBlocked) {
      alert('Este día está deshabilitado. No se pueden agendar citas.')
      return
    }
    setSelectedAppointmentId(null)
    setEditingAppointmentId(null)
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => setIsCreateModalOpen(false)

  const handleAppointmentCreated = (appointment) => {
    setSelectedDate(parseDateKey(appointment.date))
    setIsCreateModalOpen(false)
  }

  const openDetailsModal = (appointmentId) => {
    setIsCreateModalOpen(false)
    setEditingAppointmentId(null)
    setSelectedAppointmentId(appointmentId)
  }

  const closeDetailsModal = () => setSelectedAppointmentId(null)

  const openEditModal = (appointment) => {
    if (!appointment || appointment.status !== 'Confirmada') return
    setSelectedAppointmentId(null)
    setIsCreateModalOpen(false)
    setEditingAppointmentId(appointment.id)
  }

  const closeEditModal = () => setEditingAppointmentId(null)

  const handleAppointmentUpdated = (appointment) => {
    setSelectedDate(parseDateKey(appointment.date))
    setEditingAppointmentId(null)
  }

  const dateTitle = formatDate(selectedDate, { month: 'long', year: 'numeric' })

  return (
    <section className="appointments-page">
      {/* ENCABEZADO */}
      <div className="appointments-header">
        <div>
          <span className="appointments-eyebrow">GESTIÓN DE CITAS</span>
          <h2>Agenda de citas</h2>
          <p>Administra las citas médicas, solicitudes y disponibilidad de la clínica.</p>
        </div>
        
        {/* BOTONES DE ACCIÓN */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="dashboard-secondary-button"
            onClick={() => toggleBlockDate(selectedDateKey)}
            style={{
              padding: '0.5rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              background: isSelectedDateBlocked ? '#fef2f2' : '#fff',
              color: isSelectedDateBlocked ? '#dc2626' : '#374151',
              cursor: 'pointer'
            }}
          >
            {isSelectedDateBlocked ? <Unlock size={18} /> : <Ban size={18} />}
            <span>{isSelectedDateBlocked ? 'Habilitar día' : 'Bloquear día'}</span>
          </button>

          <button
            type="button"
            className="appointments-create-button"
            onClick={openCreateModal}
            disabled={isSelectedDateBlocked}
            style={{ opacity: isSelectedDateBlocked ? 0.5 : 1, cursor: isSelectedDateBlocked ? 'not-allowed' : 'pointer' }}
          >
            <Plus size={18} />
            Nueva cita
          </button>
        </div>
      </div>

      {/* CALENDARIO */}
      <div className="appointments-calendar">
        <div className="appointments-calendar-toolbar">
          <div className="appointments-calendar-navigation">
            <div className="appointments-calendar-icon">
              <CalendarDays size={19} />
            </div>
            <div className="appointments-calendar-title">
              <h3>{dateTitle}</h3>
              <span>
                {formatDate(selectedDate, { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>
          <div className="appointments-calendar-actions">
            <button type="button" className="appointments-today-button" onClick={goToToday}>
              Hoy
            </button>
            <div className="appointments-date-controls">
              <button type="button" onClick={() => changeDate(-1)}><ChevronLeft size={18} /></button>
              <button type="button" onClick={() => changeDate(1)}><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>

        {/* SELECTOR DE VISTA */}
        <div className="appointments-calendar-filters">
          <div className="appointments-view-switch">
            <button type="button" className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>Día</button>
            <button type="button" className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Semana</button>
          </div>
          
          <button 
            type="button" 
            onClick={() => blockWeek(formatDateKey(weekStart))}
            style={{ fontSize: '0.85rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Bloquear semana completa
          </button>
        </div>

        {/* DÍAS DE LA SEMANA */}
        {view === 'week' && (
          <div className="appointments-week-grid">
            {weekDays.map((date) => {
              const selected = isSameDay(date, selectedDate)
              const current = isSameDay(date, today)
              const dateKey = formatDateKey(date)
              const appointmentsCount = getAppointmentsCount(date)
              const isBlocked = blockedDays.includes(dateKey)

              return (
                <button
                  type="button"
                  key={dateKey}
                  className={`appointments-week-day ${selected ? 'selected' : ''}`}
                  onClick={() => selectDate(date)}
                  style={{
                    backgroundColor: isBlocked ? '#fef2f2' : undefined,
                    borderColor: isBlocked ? '#fca5a5' : undefined
                  }}
                >
                  <span>{formatDate(date, { weekday: 'short' })}</span>
                  <strong>{date.getDate()}</strong>
                  {current && <small>Hoy</small>}
                  {isBlocked ? (
                    <small style={{ color: '#dc2626', fontWeight: 'bold' }}>Deshabilitado</small>
                  ) : appointmentsCount > 0 ? (
                    <span className="appointments-day-count">
                      {appointmentsCount} {appointmentsCount === 1 ? 'cita' : 'citas'}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        )}

        {/* AGENDA DEL DÍA */}
        <div className="appointments-agenda">
          <div className="appointments-agenda-heading">
            <div>
              <span className="appointments-eyebrow">AGENDA DEL DÍA</span>
              <h3>
                {formatDate(selectedDate, { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
            </div>
          </div>

          {/* MENSAJE DE DÍA BLOQUEADO */}
          {isSelectedDateBlocked ? (
            <div className="appointments-agenda-empty" style={{ backgroundColor: '#fff5f5', border: '1px dashed #fca5a5', padding: '2rem', borderRadius: '12px' }}>
              <Ban size={35} color="#dc2626" strokeWidth={1.5} />
              <h4 style={{ color: '#991b1b', marginTop: '0.5rem' }}>Día deshabilitado</h4>
              <p style={{ color: '#b91c1c' }}>
                La clínica estará cerrada o la doctora no estará disponible en este día (viaje o enfermedad).
              </p>
            </div>
          ) : dailyAppointments.length === 0 ? (
            <div className="appointments-agenda-empty">
              <CalendarDays size={35} strokeWidth={1.5} />
              <h4>Sin citas programadas</h4>
              <p>No hay citas registradas para este día.</p>
            </div>
          ) : (
            <div className="appointments-list">
              {dailyAppointments.map((appointment) => {
                const statusClass = statusClasses[appointment.status] || 'confirmed'
                return (
                  <article className="appointments-card" key={appointment.id}>
                    <div className="appointments-card-time">
                      <Clock3 size={17} />
                      <strong>{appointment.time}</strong>
                      <span>{appointment.duration} min</span>
                    </div>

                    <div className="appointments-card-divider" />

                    <div className="appointments-card-patient">
                      <div className="appointments-card-avatar">
                        <UserRound size={20} />
                      </div>
                      <div className="appointments-card-info">
                        <h4>{appointment.patient?.name || 'Paciente no encontrado'}</h4>
                        <p>{appointment.service}</p>
                        <span>{appointment.patient?.phone || 'Sin teléfono'}</span>
                      </div>
                    </div>

                    <div className="appointments-card-actions">
                      <span className={`appointments-card-status ${statusClass}`}>
                        {appointment.status}
                      </span>
                      <button
                        type="button"
                        className="appointments-card-view"
                        onClick={() => openDetailsModal(appointment.id)}
                      >
                        <Eye size={16} strokeWidth={1.8} />
                        <span>Ver detalles</span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODALES */}
      <AppointmentFormModal
        key={`create-${selectedDateKey}`}
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreated={handleAppointmentCreated}
        initialDate={selectedDateKey}
      />

      <AppointmentDetailsModal
        key={selectedAppointment?.id ?? 'no-appointment'}
        appointment={selectedAppointment}
        patient={selectedPatient}
        onClose={closeDetailsModal}
        onEdit={openEditModal}
      />

      {editingAppointment && (
        <AppointmentFormModal
          key={`edit-${editingAppointment.id}`}
          isOpen={true}
          appointment={editingAppointment}
          initialDate={editingAppointment.date}
          onClose={closeEditModal}
          onUpdated={handleAppointmentUpdated}
        />
      )}
    </section>
  )
}

export default Appointments