import { useState } from 'react'

import {
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileText,
  Pill,
  Stethoscope,
} from 'lucide-react'

import { usePatients } from '../../context/PatientsContext'
import '../../styles/patient-consultations.css'

// ==========================================
// FORMATO DE FECHAS
// ==========================================

function formatDate(dateString) {
  if (!dateString) return 'No programado'

  const [year, month, day] = dateString.split('-').map(Number)

  return new Date(year, month - 1, day).toLocaleDateString('es-GT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ==========================================
// TARJETA DE CONSULTA
// ==========================================

function ConsultationCard({ consultation, index }) {
  const [expanded, setExpanded] = useState(index === 0)

  return (
    <article
      className={`consultation-card ${
        expanded ? 'consultation-card-expanded' : ''
      }`}
    >
      {/* ENCABEZADO */}

      <button
        type="button"
        className="consultation-card-header"
        onClick={() => setExpanded((previous) => !previous)}
        aria-expanded={expanded}
        aria-controls={`consultation-content-${consultation.id}`}
      >
        <div className="consultation-card-date-icon">
          <CalendarDays size={19} strokeWidth={1.8} />
        </div>

        <div className="consultation-card-heading">
          <span className="consultation-card-date">
            {formatDate(consultation.date)}
          </span>

          <h4>{consultation.reason}</h4>

          <span className="consultation-card-diagnosis">
            {consultation.diagnosis}
          </span>
        </div>

        <span
          className={`consultation-card-chevron ${
            expanded ? 'consultation-card-chevron-open' : ''
          }`}
        >
          <ChevronDown size={19} strokeWidth={1.8} />
        </span>
      </button>

      {/* DETALLES DE LA CONSULTA */}

      {expanded && (
        <div
          id={`consultation-content-${consultation.id}`}
          className="consultation-card-content"
        >
          <div className="consultation-card-details">

            <div className="consultation-detail-item">
              <div className="consultation-detail-label">
                <Stethoscope size={17} strokeWidth={1.8} />
                <span>Diagnóstico</span>
              </div>

              <p>{consultation.diagnosis}</p>
            </div>

            <div className="consultation-detail-item">
              <div className="consultation-detail-label">
                <Pill size={17} strokeWidth={1.8} />
                <span>Tratamiento indicado</span>
              </div>

              <p>
                {consultation.treatment ||
                  'No se registró un tratamiento.'}
              </p>
            </div>

            <div className="consultation-detail-item">
              <div className="consultation-detail-label">
                <FileText size={17} strokeWidth={1.8} />
                <span>Observaciones médicas</span>
              </div>

              <p>
                {consultation.observations ||
                  'Sin observaciones registradas.'}
              </p>
            </div>

            <div className="consultation-detail-item">
              <div className="consultation-detail-label">
                <CalendarDays size={17} strokeWidth={1.8} />
                <span>Próximo seguimiento</span>
              </div>

              <p>{formatDate(consultation.followUpDate)}</p>
            </div>

          </div>
        </div>
      )}
    </article>
  )
}

// ==========================================
// BITÁCORA DE CONSULTAS
// ==========================================

function ConsultationHistory({ patientId }) {
  const { getPatientConsultations } = usePatients()

  const consultations = getPatientConsultations(patientId)

  return (
    <div className="consultation-history">

      {/* ENCABEZADO */}

      <div className="consultation-history-header">
        <div>
          <span className="consultation-history-eyebrow">
            HISTORIAL DE ATENCIÓN
          </span>

          <h4>Consultas registradas</h4>

          <p>
            Revisa los diagnósticos, tratamientos y evolución
            dermatológica del paciente.
          </p>
        </div>

        <span className="consultation-history-count">
          {consultations.length}{' '}
          {consultations.length === 1 ? 'consulta' : 'consultas'}
        </span>
      </div>

      {/* ESTADO VACÍO */}

      {consultations.length === 0 ? (
        <div className="consultation-history-empty">
          <ClipboardList size={32} strokeWidth={1.5} />

          <h4>Sin consultas registradas</h4>

          <p>
            Este paciente todavía no tiene consultas en su
            expediente. Cuando registres una nueva consulta,
            aparecerá aquí.
          </p>
        </div>
      ) : (

        /* LÍNEA DE TIEMPO */

        <div className="consultation-timeline">
          {consultations.map((consultation, index) => (
            <div
              key={consultation.id}
              className="consultation-timeline-item"
            >
              <span className="consultation-timeline-dot" />

              <ConsultationCard
                consultation={consultation}
                index={index}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default ConsultationHistory