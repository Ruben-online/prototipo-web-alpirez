import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePatients } from '../context/PatientsContext'

import ConsultationHistory from '../components/patients/ConsultationHistory'
import ConsultationForm from '../components/patients/ConsultationForm'

import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileHeart,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Pill,
  Plus,
  ShieldAlert,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react'

import '../styles/patients.css'
import '../styles/patient-detail.css'

// ==========================================
// ESTRUCTURA DE ANTECEDENTES MÉDICOS
// ==========================================

const emptyMedicalHistory = {
  allergies: '',
  conditions: '',
  medications: '',
  dermatologicalHistory: '',
  observations: '',
}

// ==========================================
// CAMPOS DE ANTECEDENTES MÉDICOS
// ==========================================

const medicalFields = [
  {
    key: 'allergies',
    label: 'Alergias conocidas',
    icon: ShieldAlert,
    placeholder: 'Ej. Alergias a medicamentos o sustancias',
  },
  {
    key: 'conditions',
    label: 'Enfermedades preexistentes',
    icon: Activity,
    placeholder: 'Ej. Condiciones médicas relevantes',
  },
  {
    key: 'medications',
    label: 'Medicamentos actuales',
    icon: Pill,
    placeholder: 'Ej. Medicamentos o tratamientos actuales',
  },
  {
    key: 'dermatologicalHistory',
    label: 'Antecedentes dermatológicos',
    icon: Stethoscope,
    placeholder: 'Ej. Enfermedades o tratamientos previos de la piel',
  },
  {
    key: 'observations',
    label: 'Observaciones generales',
    icon: ClipboardList,
    placeholder: 'Información médica adicional',
  },
]

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function calculateAge(birthDate) {
  if (!birthDate) return null

  const [year, month, day] = birthDate.split('-').map(Number)
  const today = new Date()

  let age = today.getFullYear() - year

  const hasNotHadBirthday =
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)

  if (hasNotHadBirthday) {
    age--
  }

  return age
}

function formatDate(dateString) {
  if (!dateString) return 'No registrada'

  const [year, month, day] = dateString.split('-').map(Number)

  return new Date(year, month - 1, day).toLocaleDateString('es-GT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function PatientDetail() {
  const { id } = useParams()

  const {
    getPatientById,
    updateMedicalHistory,
  } = usePatients()

  const patient = getPatientById(id)

  // ==========================================
  // ESTADOS
  // ==========================================

  const [editingHistory, setEditingHistory] = useState(false)

  const [historyForm, setHistoryForm] = useState(
    emptyMedicalHistory
  )

  const [successMessage, setSuccessMessage] = useState('')

  // Controla la ventana de nueva consulta
  const [showConsultationForm, setShowConsultationForm] =
    useState(false)

  // ==========================================
  // PACIENTE NO ENCONTRADO
  // ==========================================

  if (!patient) {
    return (
      <div className="patient-detail-page">
        <Link
          to="/dashboard/pacientes"
          className="patient-detail-back"
        >
          <ArrowLeft size={18} />
          Volver al directorio
        </Link>

        <h2>Paciente no encontrado</h2>

        <p>
          No encontramos un paciente asociado con este expediente.
        </p>
      </div>
    )
  }

  // ==========================================
  // DATOS DEL PACIENTE
  // ==========================================

  const age = calculateAge(patient.birthDate)

  const medicalHistory = {
    ...emptyMedicalHistory,
    ...patient.medicalHistory,
  }

  // ==========================================
  // FUNCIONES DE ANTECEDENTES MÉDICOS
  // ==========================================

  const openHistoryEditor = () => {
    setHistoryForm({ ...medicalHistory })
    setEditingHistory(true)
    setSuccessMessage('')
  }

  const closeHistoryEditor = () => {
    setEditingHistory(false)
  }

  const handleHistoryChange = (event) => {
    const { name, value } = event.target

    setHistoryForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleHistorySubmit = (event) => {
    event.preventDefault()

    const updatedHistory = Object.fromEntries(
      Object.entries(historyForm).map(([key, value]) => [
        key,
        value.trim(),
      ])
    )

    updateMedicalHistory(patient.id, updatedHistory)

    setEditingHistory(false)

    setSuccessMessage(
      'Antecedentes médicos actualizados correctamente.'
    )
  }

  // ==========================================
  // FUNCIONES DE CONSULTAS
  // ==========================================

  const openConsultationForm = () => {
    setSuccessMessage('')
    setShowConsultationForm(true)
  }

  const closeConsultationForm = () => {
    setShowConsultationForm(false)
  }

  const handleConsultationSuccess = () => {
    setSuccessMessage(
      'La consulta dermatológica se registró correctamente.'
    )
  }

  // ==========================================
  // INTERFAZ DEL EXPEDIENTE
  // ==========================================

  return (
    <div className="patient-detail-page">

      {/* NAVEGACIÓN */}

      <Link
        to="/dashboard/pacientes"
        className="patient-detail-back"
      >
        <ArrowLeft size={17} strokeWidth={1.8} />
        Volver a pacientes
      </Link>

      {/* ENCABEZADO */}

      <section className="patient-detail-heading">
        <div>
          <span className="dashboard-section-eyebrow">
            GESTIÓN DE PACIENTES
          </span>

          <h2>Expediente clínico</h2>

          <p>
            Información personal e historial médico del paciente.
          </p>
        </div>
      </section>

      {/* MENSAJE DE CONFIRMACIÓN */}

      {successMessage && (
        <div
          className="patients-success"
          role="status"
        >
          <FileHeart size={18} strokeWidth={1.8} />

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

      {/* PERFIL DEL PACIENTE */}

      <section className="patient-detail-profile">
        <div className="patient-detail-avatar">
          {patient.initials}
        </div>

        <div className="patient-detail-identity">
          <span className="dashboard-panel-eyebrow">
            PERFIL DEL PACIENTE
          </span>

          <h3>{patient.name}</h3>

          <p>
            ID #{String(patient.id).padStart(4, '0')}
          </p>
        </div>

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
      </section>

      {/* INFORMACIÓN PERSONAL */}

      <section className="patient-detail-card">
        <div className="patient-detail-card-heading">
          <div className="patient-detail-card-icon">
            <UserRound size={20} strokeWidth={1.8} />
          </div>

          <div>
            <span className="dashboard-panel-eyebrow">
              DATOS GENERALES
            </span>

            <h3>Información personal</h3>
          </div>
        </div>

        <div className="patient-detail-info-grid">
          <div className="patient-detail-info-item">
            <span>Nombre completo</span>
            <strong>{patient.name}</strong>
          </div>

          <div className="patient-detail-info-item">
            <span>Edad</span>

            <strong>
              {age !== null
                ? `${age} años`
                : 'No registrada'}
            </strong>
          </div>

          <div className="patient-detail-info-item">
            <span>Fecha de nacimiento</span>
            <strong>{formatDate(patient.birthDate)}</strong>
          </div>

          <div className="patient-detail-info-item">
            <span>Sexo</span>
            <strong>
              {patient.sex || 'No registrado'}
            </strong>
          </div>

          <div className="patient-detail-info-item">
            <span>
              <Phone size={15} />
              Teléfono
            </span>

            <strong>
              {patient.phone || 'No registrado'}
            </strong>
          </div>

          <div className="patient-detail-info-item">
            <span>
              <Mail size={15} />
              Correo electrónico
            </span>

            <strong>
              {patient.email || 'No registrado'}
            </strong>
          </div>

          <div className="patient-detail-info-item patient-detail-info-full">
            <span>
              <MapPin size={15} />
              Dirección
            </span>

            <strong>
              {patient.address || 'No registrada'}
            </strong>
          </div>
        </div>
      </section>

      {/* RESUMEN CLÍNICO */}

      <section className="patient-detail-summary">
        <article className="patient-detail-summary-card">
          <div className="patient-detail-summary-icon">
            <ClipboardList size={20} strokeWidth={1.8} />
          </div>

          <div>
            <span>Consultas registradas</span>
            <strong>{patient.consultations}</strong>
          </div>
        </article>

        <article className="patient-detail-summary-card">
          <div className="patient-detail-summary-icon">
            <CalendarDays size={20} strokeWidth={1.8} />
          </div>

          <div>
            <span>Última consulta</span>
            <strong>{patient.lastVisit}</strong>
          </div>
        </article>
      </section>

      {/* ANTECEDENTES MÉDICOS */}

      <section className="patient-detail-card">
        <div className="patient-detail-card-heading patient-medical-heading">
          <div className="patient-detail-card-icon">
            <FileHeart size={20} strokeWidth={1.8} />
          </div>

          <div className="patient-medical-heading-text">
            <span className="dashboard-panel-eyebrow">
              EXPEDIENTE MÉDICO
            </span>

            <h3>Antecedentes médicos</h3>
          </div>

          {!editingHistory && (
            <button
              type="button"
              className="patient-medical-edit-button"
              onClick={openHistoryEditor}
            >
              <Pencil size={16} strokeWidth={1.8} />
              Editar antecedentes
            </button>
          )}
        </div>

        {editingHistory ? (
          <form
            className="patient-medical-form"
            onSubmit={handleHistorySubmit}
          >
            <p className="patient-medical-form-description">
              Actualiza los antecedentes médicos del paciente.
              Puedes dejar vacíos los campos que no correspondan.
            </p>

            <div className="patient-medical-form-grid">
              {medicalFields.map((field) => (
                <div
                  key={field.key}
                  className="patient-medical-form-field"
                >
                  <label htmlFor={`medical-${field.key}`}>
                    {field.label}
                  </label>

                  <textarea
                    id={`medical-${field.key}`}
                    name={field.key}
                    rows="3"
                    maxLength={1000}
                    placeholder={field.placeholder}
                    value={historyForm[field.key]}
                    onChange={handleHistoryChange}
                  />
                </div>
              ))}
            </div>

            <div className="patient-medical-form-actions">
              <button
                type="button"
                className="patients-cancel-button"
                onClick={closeHistoryEditor}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="dashboard-primary-button"
              >
                Guardar antecedentes
              </button>
            </div>
          </form>
        ) : (
          <div className="patient-medical-grid">
            {medicalFields.map((field) => {
              const Icon = field.icon
              const value = medicalHistory[field.key]

              return (
                <article
                  key={field.key}
                  className="patient-medical-item"
                >
                  <div className="patient-medical-item-heading">
                    <span className="patient-medical-item-icon">
                      <Icon size={17} strokeWidth={1.8} />
                    </span>

                    <h4>{field.label}</h4>
                  </div>

                  <p
                    className={
                      value ? '' : 'patient-medical-empty'
                    }
                  >
                    {value || 'Sin información registrada'}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* BITÁCORA DE CONSULTAS */}

      <section className="patient-detail-card">
        <div className="patient-detail-card-heading patient-medical-heading">
          <div className="patient-detail-card-icon">
            <ClipboardList size={20} strokeWidth={1.8} />
          </div>

          <div className="patient-medical-heading-text">
            <span className="dashboard-panel-eyebrow">
              SEGUIMIENTO
            </span>

            <h3>Bitácora de consultas</h3>
          </div>

          <button
            type="button"
            className="patient-medical-edit-button"
            onClick={openConsultationForm}
          >
            <Plus size={17} strokeWidth={2} />
            Nueva consulta
          </button>
        </div>

        <ConsultationHistory patientId={patient.id} />
      </section>

      {/* FORMULARIO MODAL DE NUEVA CONSULTA */}

      {showConsultationForm && (
        <ConsultationForm
          patientId={patient.id}
          onClose={closeConsultationForm}
          onSuccess={handleConsultationSuccess}
        />
      )}

    </div>
  )
}

export default PatientDetail