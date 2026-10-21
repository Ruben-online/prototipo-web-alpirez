import { useEffect, useRef, useState } from 'react'

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  Pencil,
  Phone,
  RefreshCw,
  Stethoscope,
  UserRound,
  UserX,
  X,
} from 'lucide-react'

import { useAppointments } from '../../context/AppointmentsContext'

import '../../styles/appointments-details-modal.css'
import '../../styles/appointments-status-actions.css'

// ==========================================
// ESTADOS DE LAS CITAS
// ==========================================

const statusClasses = {
  Confirmada: 'confirmed',
  Completada: 'completed',
  Cancelada: 'cancelled',
  'No asistió': 'missed',
}

// ==========================================
// ACCIONES ADMINISTRATIVAS
// ==========================================

const statusActions = {
  complete: {
    title: 'Marcar como completada',
    description:
      'El paciente asistió y recibió atención médica.',
    question:
      '¿Deseas marcar esta cita como completada?',
    warning:
      'La cita quedará registrada como atendida y no podrá editarse posteriormente.',
    confirmLabel: 'Confirmar atención',
    status: 'Completada',
    successMessage:
      'La cita se ha marcado como completada correctamente.',
  },

  missed: {
    title: 'Registrar inasistencia',
    description:
      'El paciente no se presentó a su consulta.',
    question:
      '¿Deseas registrar la inasistencia del paciente?',
    warning:
      'La cita quedará marcada como inasistencia y su horario dejará de estar bloqueado.',
    confirmLabel: 'Confirmar inasistencia',
    status: 'No asistió',
    successMessage:
      'La inasistencia se ha registrado correctamente.',
  },

  cancel: {
    title: 'Cancelar cita',
    description:
      'La consulta fue cancelada y se liberará su horario.',
    question:
      '¿Deseas cancelar esta cita?',
    warning:
      'La cita conservará su registro, pero dejará de aparecer en la agenda activa.',
    confirmLabel: 'Confirmar cancelación',
    status: 'Cancelada',
    successMessage:
      'La cita se ha cancelado correctamente.',
  },
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function formatAppointmentDate(dateString) {
  if (!dateString) return 'Sin fecha'

  const [year, month, day] = dateString
    .split('-')
    .map(Number)

  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('es-GT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatAppointmentTime(time) {
  if (!time) return 'Sin horario'

  const [hours, minutes] = time
    .split(':')
    .map(Number)

  const date = new Date()

  date.setHours(hours, minutes, 0, 0)

  return new Intl.DateTimeFormat('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function AppointmentDetailsModal({
  appointment,
  patient,
  onClose,
  onEdit,
}) {
  // ========================================
  // CONTEXTO
  // ========================================

  const {
    updateAppointmentStatus,
    cancelAppointment,
  } = useAppointments()

  // ========================================
  // ESTADOS
  // ========================================

  // Vistas disponibles:
  // details | actions | confirm

  const [currentView, setCurrentView] =
    useState('details')

  const [pendingAction, setPendingAction] =
    useState(null)

  const [successMessage, setSuccessMessage] =
    useState('')

  const [errorMessage, setErrorMessage] =
    useState('')

  const [isProcessing, setIsProcessing] =
    useState(false)

  const modalRef = useRef(null)
  const bodyRef = useRef(null)
  const processingRef = useRef(false)

  // ========================================
  // CITA SELECCIONADA
  // ========================================

  const appointmentId = appointment?.id ?? null

  const canEdit =
    appointment?.status === 'Confirmada'

  const selectedAction = pendingAction
    ? statusActions[pendingAction]
    : null

  // ========================================
  // REINICIAR AL CAMBIAR DE CITA
  // ========================================

  useEffect(() => {
    setCurrentView('details')
    setPendingAction(null)
    setSuccessMessage('')
    setErrorMessage('')
  }, [appointmentId])

  // ========================================
  // ENFOCAR EL MODAL
  // ========================================

  useEffect(() => {
    if (appointmentId === null) return

    modalRef.current?.focus()
  }, [appointmentId])

  // ========================================
  // CAMBIAR DE VISTA
  // ========================================

  const changeView = (view) => {
    setCurrentView(view)
    setErrorMessage('')

    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0
    }
  }

  // ========================================
  // ABRIR ACCIONES
  // ========================================

  const openActions = () => {
    if (!canEdit || isProcessing) return

    setPendingAction(null)
    setSuccessMessage('')

    changeView('actions')
  }

  // ========================================
  // SELECCIONAR ACCIÓN
  // ========================================

  const selectAction = (actionKey) => {
    if (
      !canEdit ||
      isProcessing ||
      !statusActions[actionKey]
    ) {
      return
    }

    setPendingAction(actionKey)

    changeView('confirm')
  }

  // ========================================
  // VOLVER A LA VISTA ANTERIOR
  // ========================================

  const goBack = () => {
    if (isProcessing) return

    if (currentView === 'confirm') {
      setPendingAction(null)
      changeView('actions')
      return
    }

    if (currentView === 'actions') {
      setPendingAction(null)
      changeView('details')
    }
  }

  // ========================================
  // CERRAR MODAL
  // ========================================

  const handleClose = () => {
    if (processingRef.current) return

    setCurrentView('details')
    setPendingAction(null)
    setSuccessMessage('')
    setErrorMessage('')

    onClose()
  }

  // ========================================
  // CONFIRMAR CAMBIO DE ESTADO
  // ========================================

  const confirmAction = () => {
    if (
      !appointment ||
      !canEdit ||
      !selectedAction ||
      processingRef.current
    ) {
      return
    }

    processingRef.current = true

    setIsProcessing(true)
    setErrorMessage('')

    try {
      let result

      if (pendingAction === 'cancel') {
        result = cancelAppointment(
          appointment.id
        )
      } else {
        result = updateAppointmentStatus(
          appointment.id,
          selectedAction.status
        )
      }

      // ========================================
      // ERROR
      // ========================================

      if (!result.success) {
        setErrorMessage(result.message)
        return
      }

      // ========================================
      // ÉXITO
      // ========================================

      setSuccessMessage(
        selectedAction.successMessage
      )

      setPendingAction(null)

      changeView('details')

    } catch (error) {
      console.error(
        'Error al cambiar el estado de la cita:',
        error
      )

      setErrorMessage(
        'No se pudo actualizar el estado de la cita. Inténtalo nuevamente.'
      )

    } finally {
      processingRef.current = false
      setIsProcessing(false)
    }
  }

  // ========================================
  // NO MOSTRAR SIN CITA
  // ========================================

  if (!appointment) return null

  const statusClass =
    statusClasses[appointment.status] || 'confirmed'

  // ========================================
  // CONFIGURACIÓN VISUAL DE CADA VISTA
  // ========================================

  const viewTitles = {
    details: 'Detalles de la cita',
    actions: 'Cambiar estado',
    confirm: 'Confirmar acción',
  }

  const viewDescriptions = {
    details: 'Información de la cita programada.',
    actions: 'Selecciona qué deseas hacer con esta cita.',
    confirm: 'Revisa la acción antes de continuar.',
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div
      className="appointment-details-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose()
        }
      }}
    >
      <div
        ref={modalRef}
        className="appointment-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-details-title"
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()

            if (currentView === 'details') {
              handleClose()
            } else {
              goBack()
            }
          }
        }}
      >

        {/* ========================================
            ENCABEZADO
        ======================================== */}

        <div className="appointment-details-header">

          <div className="appointment-details-header-info">

            <div className="appointment-details-header-icon">
              <CalendarDays size={22} />
            </div>

            <div>

              <span className="appointment-details-eyebrow">
                GESTIÓN DE CITAS
              </span>

              <h2 id="appointment-details-title">
                {viewTitles[currentView]}
              </h2>

              <p>
                {viewDescriptions[currentView]}
              </p>

            </div>

          </div>

          <button
            type="button"
            className="appointment-details-close"
            onClick={handleClose}
            disabled={isProcessing}
            aria-label="Cerrar ventana"
          >
            <X size={20} />
          </button>

        </div>

        {/* ========================================
            CONTENIDO DEL MODAL
        ======================================== */}

        <div
          ref={bodyRef}
          className="appointment-details-body"
        >

          {/* ========================================
              VISTA 1: DETALLES
          ======================================== */}

          {currentView === 'details' && (
            <>

              {/* ESTADO ACTUAL */}

              <div className="appointment-details-status-row">

                <span className="appointment-details-status-label">
                  Estado actual
                </span>

                <span
                  className={`appointment-details-status ${statusClass}`}
                >
                  <span className="appointment-details-status-dot" />
                  {appointment.status}
                </span>

              </div>

              {/* NOTIFICACIÓN DE ÉXITO */}

              {successMessage && (
                <div
                  className="appointment-status-notification appointment-status-notification-success"
                  role="status"
                >
                  <CheckCircle2 size={19} />

                  <span>{successMessage}</span>

                  <button
                    type="button"
                    onClick={() => setSuccessMessage('')}
                    aria-label="Cerrar mensaje de confirmación"
                  >
                    <X size={17} />
                  </button>
                </div>
              )}

              {/* INFORMACIÓN DEL PACIENTE */}

              <section className="appointment-details-section">

                <div className="appointment-details-section-title">
                  <UserRound size={17} />
                  <h3>Información del paciente</h3>
                </div>

                <div className="appointment-details-patient">

                  <div className="appointment-details-avatar">
                    {patient?.initials || (
                      <UserRound size={22} />
                    )}
                  </div>

                  <div className="appointment-details-patient-info">

                    <strong>
                      {patient?.name ||
                        'Paciente no encontrado'}
                    </strong>

                    <span>Paciente registrado</span>

                  </div>

                </div>

                <div className="appointment-details-info-grid">

                  <div className="appointment-details-info-item">

                    <span>
                      <Phone size={15} />
                      Teléfono
                    </span>

                    <strong>
                      {patient?.phone || 'No registrado'}
                    </strong>

                  </div>

                  <div className="appointment-details-info-item">

                    <span>
                      <Mail size={15} />
                      Correo electrónico
                    </span>

                    <strong className="appointment-details-email">
                      {patient?.email || 'No registrado'}
                    </strong>

                  </div>

                </div>

              </section>

              {/* INFORMACIÓN DE LA CONSULTA */}

              <section className="appointment-details-section">

                <div className="appointment-details-section-title">
                  <Stethoscope size={17} />
                  <h3>Información de la consulta</h3>
                </div>

                <div className="appointment-details-info-grid">

                  <div className="appointment-details-info-item">

                    <span>
                      <Stethoscope size={15} />
                      Tipo de consulta
                    </span>

                    <strong>
                      {appointment.service}
                    </strong>

                  </div>

                  <div className="appointment-details-info-item">

                    <span>
                      <Clock3 size={15} />
                      Duración estimada
                    </span>

                    <strong>
                      {appointment.duration} minutos
                    </strong>

                  </div>

                </div>

              </section>

              {/* FECHA Y HORARIO */}

              <section className="appointment-details-section">

                <div className="appointment-details-section-title">
                  <CalendarDays size={17} />
                  <h3>Fecha y horario</h3>
                </div>

                <div className="appointment-details-schedule">

                  <div className="appointment-details-schedule-item">

                    <div className="appointment-details-schedule-icon">
                      <CalendarDays size={19} />
                    </div>

                    <div>
                      <span>Fecha programada</span>

                      <strong>
                        {formatAppointmentDate(
                          appointment.date
                        )}
                      </strong>
                    </div>

                  </div>

                  <div className="appointment-details-schedule-item">

                    <div className="appointment-details-schedule-icon">
                      <Clock3 size={19} />
                    </div>

                    <div>
                      <span>Hora de inicio</span>

                      <strong>
                        {formatAppointmentTime(
                          appointment.time
                        )}
                      </strong>
                    </div>

                  </div>

                </div>

              </section>

              {/* OBSERVACIONES */}

              <section className="appointment-details-section">

                <div className="appointment-details-section-title">
                  <FileText size={17} />
                  <h3>Observaciones</h3>
                </div>

                <div className="appointment-details-notes">

                  {appointment.notes?.trim() ? (
                    <p>{appointment.notes}</p>
                  ) : (
                    <p className="appointment-details-no-notes">
                      No hay observaciones registradas
                      para esta cita.
                    </p>
                  )}

                </div>

              </section>

            </>
          )}

          {/* ========================================
              VISTA 2: CAMBIAR ESTADO
          ======================================== */}

          {currentView === 'actions' && (
            <div className="appointment-status-view">

              <div className="appointment-status-intro">

                <div className="appointment-status-intro-icon">
                  <RefreshCw size={23} />
                </div>

                <h3>¿Qué deseas hacer con esta cita?</h3>

                <p>
                  Selecciona una de las siguientes acciones.
                  Antes de realizar el cambio, podrás
                  confirmarlo.
                </p>

              </div>

              <div className="appointment-status-options">

                {/* COMPLETAR */}

                <button
                  type="button"
                  className="appointment-status-option appointment-status-option-complete"
                  onClick={() => selectAction('complete')}
                >
                  <span className="appointment-status-option-icon">
                    <CheckCircle2 size={21} />
                  </span>

                  <span className="appointment-status-option-content">

                    <strong>
                      Marcar como completada
                    </strong>

                    <small>
                      El paciente asistió y recibió atención.
                    </small>

                  </span>
                </button>

                {/* INASISTENCIA */}

                <button
                  type="button"
                  className="appointment-status-option appointment-status-option-missed"
                  onClick={() => selectAction('missed')}
                >
                  <span className="appointment-status-option-icon">
                    <UserX size={21} />
                  </span>

                  <span className="appointment-status-option-content">

                    <strong>
                      Registrar inasistencia
                    </strong>

                    <small>
                      El paciente no se presentó a su consulta.
                    </small>

                  </span>
                </button>

                {/* CANCELAR */}

                <button
                  type="button"
                  className="appointment-status-option appointment-status-option-cancel"
                  onClick={() => selectAction('cancel')}
                >
                  <span className="appointment-status-option-icon">
                    <X size={21} />
                  </span>

                  <span className="appointment-status-option-content">

                    <strong>
                      Cancelar cita
                    </strong>

                    <small>
                      Cancela la consulta y libera su horario.
                    </small>

                  </span>
                </button>

              </div>

            </div>
          )}

          {/* ========================================
              VISTA 3: CONFIRMAR ACCIÓN
          ======================================== */}

          {currentView === 'confirm' && selectedAction && (
            <div className="appointment-status-confirm-view">

              <div
                className={`appointment-status-confirm-card ${
                  pendingAction === 'cancel'
                    ? 'appointment-status-confirm-card-danger'
                    : ''
                }`}
              >

                <div className="appointment-status-confirm-icon">
                  <AlertTriangle size={26} />
                </div>

                <h3>
                  {selectedAction.question}
                </h3>

                <p>
                  {selectedAction.warning}
                </p>

              </div>

              {/* RESUMEN DE LA CITA */}

              <div className="appointment-status-summary">

                <h4>Cita seleccionada</h4>

                <div className="appointment-status-summary-row">
                  <span>Paciente</span>

                  <strong>
                    {patient?.name ||
                      'Paciente no encontrado'}
                  </strong>
                </div>

                <div className="appointment-status-summary-row">
                  <span>Fecha</span>

                  <strong>
                    {formatAppointmentDate(
                      appointment.date
                    )}
                  </strong>
                </div>

                <div className="appointment-status-summary-row">
                  <span>Hora</span>

                  <strong>
                    {formatAppointmentTime(
                      appointment.time
                    )}
                  </strong>
                </div>

                <div className="appointment-status-summary-row">
                  <span>Nuevo estado</span>

                  <strong>
                    {selectedAction.status}
                  </strong>
                </div>

              </div>

              {/* MENSAJE DE ERROR */}

              {errorMessage && (
                <div
                  className="appointment-status-notification appointment-status-notification-error"
                  role="alert"
                >
                  <AlertCircle size={19} />

                  <span>{errorMessage}</span>

                  <button
                    type="button"
                    onClick={() => setErrorMessage('')}
                    aria-label="Cerrar mensaje de error"
                  >
                    <X size={17} />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* ========================================
            FOOTER DINÁMICO
        ======================================== */}

        <div className="appointment-details-footer appointment-status-footer">

          {/* VISTA DETALLES */}

          {currentView === 'details' && (
            <>
              <button
                type="button"
                className="appointment-details-close-button"
                onClick={handleClose}
              >
                Cerrar
              </button>

              {canEdit && (
                <>
                  <button
                    type="button"
                    className="appointment-status-open-button"
                    onClick={openActions}
                  >
                    <RefreshCw size={17} />
                    Cambiar estado
                  </button>

                  <button
                    type="button"
                    className="appointment-details-edit-button"
                    onClick={() => onEdit?.(appointment)}
                  >
                    <Pencil size={17} />
                    Editar cita
                  </button>
                </>
              )}
            </>
          )}

          {/* VISTA CAMBIAR ESTADO */}

          {currentView === 'actions' && (
            <button
              type="button"
              className="appointment-status-back-button"
              onClick={goBack}
            >
              <ArrowLeft size={17} />
              Volver a detalles
            </button>
          )}

          {/* VISTA CONFIRMACIÓN */}

          {currentView === 'confirm' && selectedAction && (
            <>
              <button
                type="button"
                className="appointment-status-back-button"
                onClick={goBack}
                disabled={isProcessing}
              >
                <ArrowLeft size={17} />
                Volver
              </button>

              <button
                type="button"
                className={`appointment-status-confirm-button ${
                  pendingAction === 'cancel'
                    ? 'appointment-status-confirm-button-danger'
                    : ''
                }`}
                onClick={confirmAction}
                disabled={isProcessing}
              >
                <CheckCircle2 size={17} />

                {isProcessing
                  ? 'Procesando...'
                  : selectedAction.confirmLabel}
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  )
}

export default AppointmentDetailsModal