import { useEffect, useState } from 'react'

import {
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileText,
  Pill,
  Stethoscope,
} from 'lucide-react'

import { usePatients } from '../../hooks/usePatients'
import '../../styles/patients/patient-consultations.css'

// ==========================================
// FORMATO DE FECHAS
// ==========================================

function formatDate(dateString) {
  if (!dateString) return 'No programado'

  const [year, month, day] = dateString
    .split('T')[0]
    .split('-')
    .map(Number)

  return new Date(year, month - 1, day).toLocaleDateString(
    'es-GT',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  )
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

  // ========================================
  // ESTADOS
  // ========================================

  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ========================================
  // CARGAR CONSULTAS DESDE SUPABASE
  // ========================================

  useEffect(() => {
    let cancelled = false

    const loadConsultations = async () => {
      setLoading(true)
      setError('')
      setConsultations([])

      try {
        const data = await getPatientConsultations(patientId)

        if (cancelled) return

        if (!Array.isArray(data)) {
          throw new Error(
            'El historial de consultas tiene un formato inválido.'
          )
        }

        setConsultations(data)
      } catch (err) {
        if (cancelled) return

        console.error(
          'Error al cargar el historial de consultas:',
          err
        )

        setError(
          'No se pudo cargar el historial de consultas.'
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadConsultations()

    return () => {
      cancelled = true
    }
  }, [patientId, getPatientConsultations])

  // ========================================
  // INTERFAZ
  // ========================================

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
          {loading
            ? 'Cargando...'
            : `${consultations.length} ${
                consultations.length === 1
                  ? 'consulta'
                  : 'consultas'
              }`}
        </span>
      </div>

      {/* ESTADO DE CARGA */}

      {loading && (
        <div
          className="consultation-history-empty"
          role="status"
        >
          <ClipboardList size={32} strokeWidth={1.5} />

          <h4>Cargando consultas...</h4>

          <p>
            Estamos consultando el historial médico del paciente.
          </p>
        </div>
      )}

      {/* ESTADO DE ERROR */}

      {!loading && error && (
        <div
          className="consultation-history-empty"
          role="alert"
        >
          <ClipboardList size={32} strokeWidth={1.5} />

          <h4>No se pudo cargar el historial</h4>

          <p>{error}</p>
        </div>
      )}

      {/* ESTADO VACÍO */}

      {!loading && !error && consultations.length === 0 && (
        <div className="consultation-history-empty">
          <ClipboardList size={32} strokeWidth={1.5} />

          <h4>Sin consultas registradas</h4>

          <p>
            Este paciente todavía no tiene consultas en su
            expediente. Cuando registres una nueva consulta,
            aparecerá aquí.
          </p>
        </div>
      )}

      {/* LÍNEA DE TIEMPO */}

      {!loading && !error && consultations.length > 0 && (
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