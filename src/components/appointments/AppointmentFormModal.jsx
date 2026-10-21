import { useEffect, useRef, useState } from 'react'

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react'

import { usePatients } from '../../context/PatientsContext'
import { useAppointments } from '../../context/AppointmentsContext'

import '../../styles/appointments-form-modal.css'

// ==========================================
// CONFIGURACIÓN DEL FORMULARIO
// ==========================================

const services = [
  'Consulta dermatológica',
  'Dermatología clínica',
  'Dermatología estética',
  'Control de dermatitis',
  'Tratamiento de acné',
  'Evaluación de manchas',
  'Consulta de seguimiento',
  'Otro',
]

const durations = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '60 minutos' },
]

// Horario configurable de la clínica.
// 08:00 a 18:00, en intervalos de 15 minutos.

const CLINIC_START_HOUR = 8
const CLINIC_END_HOUR = 18
const TIME_INTERVAL = 15

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getInitialForm(date, appointment = null) {
  if (appointment) {
    return {
      patientId: String(appointment.patientId),
      service: appointment.service || '',
      date: appointment.date,
      time: appointment.time,
      duration: Number(appointment.duration),
      notes: appointment.notes || '',
    }
  }

  return {
    patientId: '',
    service: '',
    date: date || formatDateKey(new Date()),
    time: '',
    duration: 30,
    notes: '',
  }
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    `${String(hours).padStart(2, '0')}:` +
    `${String(minutes).padStart(2, '0')}`
  )
}

function formatTimeLabel(time) {
  const [hours, minutes] = time.split(':').map(Number)

  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 || 12

  return (
    `${String(displayHour).padStart(2, '0')}:` +
    `${String(minutes).padStart(2, '0')} ${period}`
  )
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function AppointmentFormModal({
  isOpen,
  onClose,
  onCreated,
  onUpdated,
  initialDate,
  appointment = null,
}) {
  // ========================================
  // MODO DEL FORMULARIO
  // ========================================

  const isEditing = Boolean(appointment)

  // ========================================
  // CONTEXTOS
  // ========================================

  const { patients } = usePatients()

  const {
    addAppointment,
    updateAppointment,
    isTimeAvailable,
  } = useAppointments()

  // ========================================
  // ESTADOS
  // ========================================

  const [formData, setFormData] = useState(
    () => getInitialForm(initialDate, appointment)
  )

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [savedAppointment, setSavedAppointment] =
    useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Protección adicional contra doble envío.

  const submittingRef = useRef(false)

  // ========================================
  // PACIENTES DISPONIBLES
  // ========================================

  const availablePatients = [...patients]
    .filter(
      (patient) =>
        patient.status === 'Activo' ||
        String(patient.id) === formData.patientId
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, 'es')
    )

  // ========================================
  // SERVICIOS DISPONIBLES
  // ========================================

  // Conservar el servicio de una cita antigua
  // aunque ya no aparezca en el catálogo actual.

  const availableServices = [...services]

  if (
    formData.service &&
    !availableServices.includes(formData.service)
  ) {
    availableServices.push(formData.service)
  }

  // ========================================
  // DURACIONES DISPONIBLES
  // ========================================

  const availableDurations = [...durations]

  if (
    formData.duration > 0 &&
    !availableDurations.some(
      (item) => item.value === Number(formData.duration)
    )
  ) {
    availableDurations.push({
      value: Number(formData.duration),
      label: `${formData.duration} minutos`,
    })

    availableDurations.sort(
      (a, b) => a.value - b.value
    )
  }

  // ========================================
  // GENERAR HORARIOS
  // ========================================

  const clinicStartMinutes = CLINIC_START_HOUR * 60
  const clinicEndMinutes = CLINIC_END_HOUR * 60

  const selectedDuration = Number(formData.duration)

  const timeOptions = []

  for (
    let minutes = clinicStartMinutes;
    minutes + selectedDuration <= clinicEndMinutes;
    minutes += TIME_INTERVAL
  ) {
    const time = minutesToTime(minutes)

    const available = isTimeAvailable(
      formData.date,
      time,
      selectedDuration,
      isEditing ? appointment.id : null
    )

    timeOptions.push({
      value: time,
      label: formatTimeLabel(time),
      available,
    })
  }

  // Si una cita antigua tiene una hora fuera del
  // horario configurado, permitimos visualizarla.

  if (
    isEditing &&
    formData.time &&
    !timeOptions.some(
      (option) => option.value === formData.time
    )
  ) {
    const currentTimeMinutes = timeToMinutes(formData.time)

    const available = isTimeAvailable(
      formData.date,
      formData.time,
      selectedDuration,
      appointment.id
    )

    if (
      currentTimeMinutes >= 0 &&
      currentTimeMinutes < 1440
    ) {
      timeOptions.push({
        value: formData.time,
        label: `${formatTimeLabel(formData.time)} (horario original)`,
        available,
      })

      timeOptions.sort(
        (a, b) => a.value.localeCompare(b.value)
      )
    }
  }

  // ========================================
  // CERRAR EL FORMULARIO
  // ========================================

  const handleClose = () => {
    if (submittingRef.current) return

    // Notificar a la agenda cuando una operación
    // se completó correctamente.

    if (savedAppointment) {
      if (isEditing) {
        onUpdated?.(savedAppointment)
      } else {
        onCreated?.(savedAppointment)
      }
    }

    setError('')
    setSuccess('')
    setSavedAppointment(null)

    setFormData(
      getInitialForm(initialDate, appointment)
    )

    onClose()
  }

  // ========================================
  // BLOQUEAR SCROLL DEL FONDO
  // ========================================

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [isOpen])

  // ========================================
  // ACTUALIZAR CAMPOS
  // ========================================

  const handleChange = (event) => {
    if (savedAppointment || submittingRef.current) {
      return
    }

    const { name, value } = event.target

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      }

      // Si cambia la fecha o duración, limpiamos
      // el horario cuando deja de estar disponible.

      if (
        name === 'date' ||
        name === 'duration'
      ) {
        const duration = Number(updated.duration)

        const currentTime = updated.time

        if (currentTime) {
          const available = isTimeAvailable(
            updated.date,
            currentTime,
            duration,
            isEditing ? appointment.id : null
          )

          const start = timeToMinutes(currentTime)

          const insideClinicHours =
            start >= clinicStartMinutes &&
            start + duration <= clinicEndMinutes

          const isOriginalTime =
            isEditing &&
            currentTime === appointment.time

          if (
            !available ||
            (!insideClinicHours && !isOriginalTime)
          ) {
            updated.time = ''
          }
        }
      }

      return updated
    })

    setError('')
  }

  // ========================================
  // GUARDAR CITA
  // ========================================

  const handleSubmit = (event) => {
    event.preventDefault()

    if (
      submittingRef.current ||
      savedAppointment
    ) {
      return
    }

    setError('')
    setSuccess('')

    // ========================================
    // VALIDAR PACIENTE
    // ========================================

    if (!formData.patientId) {
      setError('Selecciona un paciente.')
      return
    }

    const selectedPatient = availablePatients.find(
      (patient) =>
        String(patient.id) === formData.patientId
    )

    if (!selectedPatient) {
      setError('Selecciona un paciente válido.')
      return
    }

    // ========================================
    // VALIDAR SERVICIO
    // ========================================

    if (!formData.service) {
      setError('Selecciona el tipo de consulta.')
      return
    }

    // ========================================
    // VALIDAR FECHA
    // ========================================

    if (!formData.date) {
      setError('Selecciona una fecha.')
      return
    }

    // ========================================
    // VALIDAR HORA
    // ========================================

    if (!formData.time) {
      setError('Selecciona un horario disponible.')
      return
    }

    const selectedTimeOption = timeOptions.find(
      (option) =>
        option.value === formData.time
    )

    if (
      !selectedTimeOption ||
      !selectedTimeOption.available
    ) {
      setError(
        'El horario seleccionado ya no está disponible. Elige otra hora.'
      )
      return
    }

    // ========================================
    // PREPARAR DATOS
    // ========================================

    const appointmentData = {
      patientId: Number(formData.patientId),
      service: formData.service,
      date: formData.date,
      time: formData.time,
      duration: Number(formData.duration),
      notes: formData.notes.trim(),
    }

    // ========================================
    // BLOQUEAR DOBLE ENVÍO
    // ========================================

    submittingRef.current = true
    setIsSubmitting(true)

    try {
      // ========================================
      // CREAR O ACTUALIZAR
      // ========================================

      const result = isEditing
        ? updateAppointment(
            appointment.id,
            appointmentData
          )
        : addAppointment(appointmentData)

      // ========================================
      // OPERACIÓN FALLIDA
      // ========================================

      if (!result.success) {
        if (
          result.message
            .toLowerCase()
            .includes('horario')
        ) {
          setError(
            'El horario seleccionado ya está ocupado. Elige otra hora para continuar.'
          )
        } else {
          setError(result.message)
        }

        return
      }

      // ========================================
      // OPERACIÓN EXITOSA
      // ========================================

      setSavedAppointment(result.appointment)

      setSuccess(
        isEditing
          ? 'Los cambios de la cita se han guardado correctamente.'
          : 'La cita se ha registrado correctamente.'
      )

      setError('')

    } catch (submitError) {
      console.error(
        'Error al guardar la cita:',
        submitError
      )

      setError(
        'No se pudo guardar la cita. Inténtalo nuevamente.'
      )

    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  // ========================================
  // NO MOSTRAR CUANDO ESTÁ CERRADO
  // ========================================

  if (!isOpen) return null

  const appointmentSaved =
    Boolean(savedAppointment)

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      className="appointment-form-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose()
        }
      }}
    >
      <div
        className="appointment-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-form-title"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            handleClose()
          }
        }}
      >

        {/* ========================================
            ENCABEZADO
        ======================================== */}

        <div className="appointment-form-header">

          <div className="appointment-form-header-info">

            <div className="appointment-form-header-icon">
              <CalendarDays size={22} />
            </div>

            <div>
              <span className="appointment-form-eyebrow">
                GESTIÓN DE CITAS
              </span>

              <h2 id="appointment-form-title">
                {isEditing
                  ? 'Editar cita'
                  : 'Nueva cita'}
              </h2>

              <p>
                {isEditing
                  ? 'Modifica los datos o reprograma la cita.'
                  : 'Programa una nueva cita médica.'}
              </p>
            </div>

          </div>

          <button
            type="button"
            className="appointment-form-close"
            onClick={handleClose}
            aria-label="Cerrar formulario"
          >
            <X size={20} />
          </button>

        </div>

        {/* ========================================
            FORMULARIO
        ======================================== */}

        <form
          id="appointment-create-form"
          className="appointment-form"
          onSubmit={handleSubmit}
        >
          <fieldset
            className="appointment-form-fields"
            disabled={
              appointmentSaved ||
              isSubmitting
            }
          >

            {/* ========================================
                PACIENTE
            ======================================== */}

            <div className="appointment-form-section">

              <div className="appointment-form-section-title">
                <UserRound size={17} />
                <h3>Información del paciente</h3>
              </div>

              <div className="appointment-form-field">

                <label htmlFor="appointment-patient">
                  Paciente *
                </label>

                <select
                  id="appointment-patient"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Seleccionar paciente
                  </option>

                  {availablePatients.map((patient) => (
                    <option
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.name}
                    </option>
                  ))}
                </select>

                <small>
                  Selecciona un paciente registrado
                  en el sistema.
                </small>

              </div>

            </div>

            {/* ========================================
                SERVICIO
            ======================================== */}

            <div className="appointment-form-section">

              <div className="appointment-form-section-title">
                <Stethoscope size={17} />
                <h3>Información de la consulta</h3>
              </div>

              <div className="appointment-form-field">

                <label htmlFor="appointment-service">
                  Tipo de consulta *
                </label>

                <select
                  id="appointment-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Seleccionar servicio
                  </option>

                  {availableServices.map((service) => (
                    <option
                      key={service}
                      value={service}
                    >
                      {service}
                    </option>
                  ))}
                </select>

              </div>

            </div>

            {/* ========================================
                FECHA Y HORARIO
            ======================================== */}

            <div className="appointment-form-section">

              <div className="appointment-form-section-title">
                <Clock3 size={17} />
                <h3>Fecha y horario</h3>
              </div>

              <div className="appointment-form-grid">

                {/* FECHA */}

                <div className="appointment-form-field">

                  <label htmlFor="appointment-date">
                    Fecha *
                  </label>

                  <input
                    id="appointment-date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />

                </div>

                {/* HORARIO DESPLEGABLE */}

                <div className="appointment-form-field">

                  <label htmlFor="appointment-time">
                    Hora *
                  </label>

                  <select
                    id="appointment-time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Seleccionar horario
                    </option>

                    {timeOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={!option.available}
                      >
                        {option.label}
                        {!option.available
                          ? ' — Ocupado'
                          : ''}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

              {/* DURACIÓN */}

              <div className="appointment-form-field">

                <label htmlFor="appointment-duration">
                  Duración estimada *
                </label>

                <select
                  id="appointment-duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                >
                  {availableDurations.map((duration) => (
                    <option
                      key={duration.value}
                      value={duration.value}
                    >
                      {duration.label}
                    </option>
                  ))}
                </select>

                <small>
                  Los horarios ocupados se muestran
                  deshabilitados según la fecha y duración.
                </small>

              </div>

            </div>

            {/* ========================================
                OBSERVACIONES
            ======================================== */}

            <div className="appointment-form-section">

              <div className="appointment-form-section-title">
                <FileText size={17} />
                <h3>Observaciones</h3>
              </div>

              <div className="appointment-form-field">

                <label htmlFor="appointment-notes">
                  Notas adicionales
                </label>

                <textarea
                  id="appointment-notes"
                  name="notes"
                  rows={3}
                  maxLength={500}
                  placeholder="Información administrativa relevante..."
                  value={formData.notes}
                  onChange={handleChange}
                />

                <small>
                  Opcional. Evita incluir
                  información médica sensible.
                </small>

              </div>

            </div>

          </fieldset>
        </form>

        {/* ========================================
            NOTIFICACIÓN DE ERROR
        ======================================== */}

        {error && (
          <div
            className="appointment-form-notification"
            role="alert"
          >
            <AlertCircle size={19} strokeWidth={2} />

            <span>{error}</span>

            <button
              type="button"
              aria-label="Cerrar mensaje de error"
              onClick={() => setError('')}
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* ========================================
            NOTIFICACIÓN DE ÉXITO
        ======================================== */}

        {success && (
          <div
            className="appointment-form-notification appointment-form-notification-success"
            role="status"
          >
            <CheckCircle2 size={19} strokeWidth={2} />

            <span>{success}</span>

            <button
              type="button"
              aria-label="Cerrar mensaje de confirmación"
              onClick={() => setSuccess('')}
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* ========================================
            PIE DEL MODAL
        ======================================== */}

        <div className="appointment-form-footer">

          {appointmentSaved ? (
            <>
              <button
                type="button"
                className="appointment-form-cancel"
                onClick={handleClose}
              >
                Cerrar
              </button>

              <button
                type="button"
                className="appointment-form-submit"
                onClick={handleClose}
              >
                <CalendarDays size={18} />
                Ver cita en agenda
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="appointment-form-cancel"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="appointment-create-form"
                className="appointment-form-submit"
                disabled={isSubmitting}
              >
                <CheckCircle2 size={18} />

                {isSubmitting
                  ? 'Guardando...'
                  : isEditing
                    ? 'Guardar cambios'
                    : 'Guardar cita'}
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  )
}

export default AppointmentFormModal