import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  UserRoundCheck,
  UserRoundX,
  X,
} from 'lucide-react'

function PatientStatusModal({ patient, onClose, onConfirm }) {
  if (!patient) return null

  const isActive = patient.status === 'Activo'

  return (
    <div
      className="patients-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
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
              isActive ? 'deactivate' : 'activate'
            }`}
          >
            {isActive ? (
              <AlertTriangle size={25} strokeWidth={1.8} />
            ) : (
              <CheckCircle2 size={25} strokeWidth={1.8} />
            )}
          </div>

          <button
            type="button"
            className="patients-modal-close"
            onClick={onClose}
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
            {isActive
              ? '¿Desactivar paciente?'
              : '¿Activar paciente?'}
          </h3>

          <p id="patients-status-modal-description">
            {isActive
              ? 'El paciente pasará a estado inactivo y dejará de aparecer en el filtro de pacientes activos.'
              : 'El paciente volverá a estar activo y aparecerá nuevamente en el filtro de pacientes activos.'}
          </p>

          {/* INFORMACIÓN DEL PACIENTE */}

          <div className="patients-status-modal-patient">

            <div className="patients-status-modal-avatar">
              {patient.initials}
            </div>

            <div className="patients-status-modal-patient-info">
              <strong>{patient.name}</strong>

              <span>
                ID #{String(patient.id).padStart(4, '0')}
              </span>
            </div>

            <span
              className={`patients-status ${
                isActive ? 'active' : 'inactive'
              }`}
            >
              <span className="patients-status-dot" />
              {patient.status}
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
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={`patients-status-confirm-button ${
              isActive ? 'deactivate' : 'activate'
            }`}
            onClick={onConfirm}
          >
            {isActive ? (
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
  )
}

export default PatientStatusModal