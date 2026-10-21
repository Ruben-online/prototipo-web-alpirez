import { useEffect, useState } from 'react'

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock3,
  UserRound,
  Eye,
} from 'lucide-react'

import { usePatients } from '../context/PatientsContext'
import { useAppointments } from '../context/AppointmentsContext'

import AppointmentFormModal from '../components/appointments/AppointmentFormModal'
import AppointmentDetailsModal from '../components/appointments/AppointmentDetailsModal'

import '../styles/appointments.css'

// ========================================
// FUNCIONES AUXILIARES
// ========================================

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

  result.setDate(
    result.getDate() + (day === 0 ? -6 : 1 - day)
  )

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
  const [year, month, day] = dateString
    .split('-')
    .map(Number)

  return new Date(year, month - 1, day)
}

// ========================================
// ESTADOS DE LAS CITAS
// ========================================

const statusClasses = {
  Confirmada: 'confirmed',
  Completada: 'completed',
  Cancelada: 'cancelled',
  'No asistió': 'missed',
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

function Appointments() {
  // ========================================
  // CONTEXTOS
  // ========================================

  const { patients } = usePatients()

  const {
    appointments,
    getAppointmentsByDate,
  } = useAppointments()

  // ========================================
  // ESTADOS DEL CALENDARIO
  // ========================================

  const [selectedDate, setSelectedDate] = useState(
    () => new Date()
  )

  const [view, setView] = useState('week')

  // ========================================
  // ESTADOS DE LOS MODALES
  // ========================================

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false)

  const [selectedAppointmentId, setSelectedAppointmentId] =
    useState(null)

  const [editingAppointmentId, setEditingAppointmentId] =
    useState(null)

  // ========================================
  // FECHAS
  // ========================================

  const today = new Date()

  const weekStart = getWeekStart(selectedDate)

  const weekDays = Array.from(
    { length: 7 },
    (_, index) => addDays(weekStart, index)
  )

  const selectedDateKey = formatDateKey(selectedDate)

  // ========================================
  // CITAS DEL DÍA
  // ========================================

  const dailyAppointments = getAppointmentsByDate(
    selectedDateKey
  )
    .filter(
      (appointment) =>
        appointment.status !== 'Cancelada'
    )
    .map((appointment) => ({
      ...appointment,

      patient: patients.find(
        (patient) =>
          String(patient.id) ===
          String(appointment.patientId)
      ),
    }))

  // ========================================
  // CONTAR CITAS
  // ========================================

  const getAppointmentsCount = (date) => {
    const dateKey = formatDateKey(date)

    return appointments.filter(
      (appointment) =>
        appointment.date === dateKey &&
        appointment.status !== 'Cancelada'
    ).length
  }

  // ========================================
  // CITA SELECCIONADA
  // ========================================

  const selectedAppointment = appointments.find(
    (appointment) =>
      String(appointment.id) ===
      String(selectedAppointmentId)
  )

  const selectedPatient = selectedAppointment
    ? patients.find(
        (patient) =>
          String(patient.id) ===
          String(selectedAppointment.patientId)
      )
    : null

  // ========================================
  // CITA EN EDICIÓN
  // ========================================

  const editingAppointment = appointments.find(
    (appointment) =>
      String(appointment.id) ===
      String(editingAppointmentId)
  )

  // ========================================
  // NAVEGACIÓN DEL CALENDARIO
  // ========================================

  const changeDate = (direction) => {
    setSelectedDate((current) =>
      addDays(
        current,
        direction * (view === 'week' ? 7 : 1)
      )
    )
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const selectDate = (date) => {
    setSelectedDate(date)
  }

  // ========================================
  // MODAL NUEVA CITA
  // ========================================

  const openCreateModal = () => {
    setSelectedAppointmentId(null)
    setEditingAppointmentId(null)
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleAppointmentCreated = (appointment) => {
    setSelectedDate(
      parseDateKey(appointment.date)
    )

    setIsCreateModalOpen(false)
  }

  // ========================================
  // MODAL DETALLES
  // ========================================

  const openDetailsModal = (appointmentId) => {
    setIsCreateModalOpen(false)
    setEditingAppointmentId(null)
    setSelectedAppointmentId(appointmentId)
  }

  const closeDetailsModal = () => {
    setSelectedAppointmentId(null)
  }

  // ========================================
  // MODAL EDITAR CITA
  // ========================================

  const openEditModal = (appointment) => {
    if (
      !appointment ||
      appointment.status !== 'Confirmada'
    ) {
      return
    }

    setSelectedAppointmentId(null)
    setIsCreateModalOpen(false)
    setEditingAppointmentId(appointment.id)
  }

  const closeEditModal = () => {
    setEditingAppointmentId(null)
  }

  const handleAppointmentUpdated = (appointment) => {
    // La cita ya fue actualizada en el contexto.
    // Aquí únicamente cambiamos la fecha visible.

    setSelectedDate(
      parseDateKey(appointment.date)
    )

    setEditingAppointmentId(null)
  }

  // ========================================
  // BLOQUEAR SCROLL EN DETALLES
  // ========================================

  useEffect(() => {
    if (selectedAppointmentId === null) return

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedAppointmentId(null)
      }
    }

    document.addEventListener(
      'keydown',
      handleEscape
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      document.removeEventListener(
        'keydown',
        handleEscape
      )
    }
  }, [selectedAppointmentId])

  // ========================================
  // TÍTULO DEL CALENDARIO
  // ========================================

  const dateTitle = formatDate(selectedDate, {
    month: 'long',
    year: 'numeric',
  })

  // ========================================
  // RENDER
  // ========================================

  return (
    <section className="appointments-page">

      {/* ========================================
          ENCABEZADO
      ======================================== */}

      <div className="appointments-header">

        <div>
          <span className="appointments-eyebrow">
            GESTIÓN DE CITAS
          </span>

          <h2>Agenda de citas</h2>

          <p>
            Administra las citas médicas, solicitudes
            y disponibilidad de la clínica.
          </p>
        </div>

        <button
          type="button"
          className="appointments-create-button"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          Nueva cita
        </button>

      </div>

      {/* ========================================
          CALENDARIO
      ======================================== */}

      <div className="appointments-calendar">

        {/* ========================================
            BARRA DEL CALENDARIO
        ======================================== */}

        <div className="appointments-calendar-toolbar">

          <div className="appointments-calendar-navigation">

            <div className="appointments-calendar-icon">
              <CalendarDays size={19} />
            </div>

            <div className="appointments-calendar-title">

              <h3>{dateTitle}</h3>

              <span>
                {formatDate(selectedDate, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>

            </div>

          </div>

          <div className="appointments-calendar-actions">

            <button
              type="button"
              className="appointments-today-button"
              onClick={goToToday}
            >
              Hoy
            </button>

            <div className="appointments-date-controls">

              <button
                type="button"
                aria-label={
                  view === 'week'
                    ? 'Semana anterior'
                    : 'Día anterior'
                }
                onClick={() => changeDate(-1)}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                aria-label={
                  view === 'week'
                    ? 'Semana siguiente'
                    : 'Día siguiente'
                }
                onClick={() => changeDate(1)}
              >
                <ChevronRight size={18} />
              </button>

            </div>

          </div>

        </div>

        {/* ========================================
            SELECTOR DE VISTA
        ======================================== */}

        <div className="appointments-calendar-filters">

          <div className="appointments-view-switch">

            <button
              type="button"
              className={
                view === 'day' ? 'active' : ''
              }
              onClick={() => setView('day')}
            >
              Día
            </button>

            <button
              type="button"
              className={
                view === 'week' ? 'active' : ''
              }
              onClick={() => setView('week')}
            >
              Semana
            </button>

          </div>

          <span className="appointments-calendar-hint">
            Selecciona un día para consultar su agenda
          </span>

        </div>

        {/* ========================================
            DÍAS DE LA SEMANA
        ======================================== */}

        {view === 'week' && (

          <div className="appointments-week-grid">

            {weekDays.map((date) => {
              const selected = isSameDay(
                date,
                selectedDate
              )

              const current = isSameDay(
                date,
                today
              )

              const dateKey = formatDateKey(date)

              const appointmentsCount =
                getAppointmentsCount(date)

              return (
                <button
                  type="button"
                  key={dateKey}
                  className={`appointments-week-day ${
                    selected ? 'selected' : ''
                  }`}
                  onClick={() => selectDate(date)}
                >

                  <span>
                    {formatDate(date, {
                      weekday: 'short',
                    })}
                  </span>

                  <strong>
                    {date.getDate()}
                  </strong>

                  {current && <small>Hoy</small>}

                  {appointmentsCount > 0 && (
                    <span className="appointments-day-count">
                      {appointmentsCount}{' '}
                      {appointmentsCount === 1
                        ? 'cita'
                        : 'citas'}
                    </span>
                  )}

                </button>
              )
            })}

          </div>
        )}

        {/* ========================================
            AGENDA DEL DÍA
        ======================================== */}

        <div className="appointments-agenda">

          <div className="appointments-agenda-heading">

            <div>
              <span className="appointments-eyebrow">
                AGENDA DEL DÍA
              </span>

              <h3>
                {formatDate(selectedDate, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h3>
            </div>

          </div>

          {/* ========================================
              LISTADO DE CITAS
          ======================================== */}

          {dailyAppointments.length === 0 ? (

            <div className="appointments-agenda-empty">

              <CalendarDays
                size={35}
                strokeWidth={1.5}
              />

              <h4>Sin citas programadas</h4>

              <p>
                No hay citas registradas para este día.
              </p>

            </div>

          ) : (

            <div className="appointments-list">

              {dailyAppointments.map((appointment) => {
                const statusClass =
                  statusClasses[appointment.status] ||
                  'confirmed'

                return (
                  <article
                    className="appointments-card"
                    key={appointment.id}
                  >

                    {/* HORA */}

                    <div className="appointments-card-time">

                      <Clock3 size={17} />

                      <strong>
                        {appointment.time}
                      </strong>

                      <span>
                        {appointment.duration} min
                      </span>

                    </div>

                    <div className="appointments-card-divider" />

                    {/* PACIENTE */}

                    <div className="appointments-card-patient">

                      <div className="appointments-card-avatar">
                        <UserRound size={20} />
                      </div>

                      <div className="appointments-card-info">

                        <h4>
                          {appointment.patient?.name ||
                            'Paciente no encontrado'}
                        </h4>

                        <p>{appointment.service}</p>

                        <span>
                          {appointment.patient?.phone ||
                            'Sin teléfono'}
                        </span>

                      </div>

                    </div>

                    {/* ESTADO Y ACCIONES */}

                    <div className="appointments-card-actions">

                      <span
                        className={`appointments-card-status ${statusClass}`}
                      >
                        {appointment.status}
                      </span>

                      <button
                        type="button"
                        className="appointments-card-view"
                        aria-label={`Ver detalles de ${
                          appointment.patient?.name ||
                          'la cita'
                        }`}
                        title="Ver detalles de la cita"
                        onClick={() =>
                          openDetailsModal(appointment.id)
                        }
                      >
                        <Eye
                          size={16}
                          strokeWidth={1.8}
                        />

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

      {/* ========================================
          MODAL CREAR CITA
      ======================================== */}

      <AppointmentFormModal
        key={`create-${selectedDateKey}`}
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreated={handleAppointmentCreated}
        initialDate={selectedDateKey}
      />

      {/* ========================================
          MODAL DETALLES
      ======================================== */}

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        patient={selectedPatient}
        onClose={closeDetailsModal}
        onEdit={openEditModal}
      />

      {/* ========================================
          MODAL EDITAR CITA
      ======================================== */}

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