import { useState } from 'react'
import { CalendarDays, Save, X } from 'lucide-react'
import { usePatients } from '../../context/PatientsContext'

const initialForm = {
  date: new Date().toLocaleDateString('en-CA'),
  reason: '',
  diagnosis: '',
  treatment: '',
  observations: '',
  followUpDate: '',
}

function ConsultationForm({ patientId, onClose, onSuccess }) {
  const { addConsultation } = usePatients()

  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (error) setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (
      !form.date ||
      !form.reason.trim() ||
      !form.diagnosis.trim()
    ) {
      setError(
        'Completa la fecha, el motivo y el diagnóstico.'
      )
      return
    }

    if (form.followUpDate && form.followUpDate < form.date) {
      setError(
        'La fecha de seguimiento no puede ser anterior a la consulta.'
      )
      return
    }

    const newConsultation = addConsultation({
      patientId: Number(patientId),
      date: form.date,
      reason: form.reason.trim(),
      diagnosis: form.diagnosis.trim(),
      treatment: form.treatment.trim(),
      observations: form.observations.trim(),
      followUpDate: form.followUpDate,
    })

    if (!newConsultation) {
      setError('No fue posible registrar la consulta.')
      return
    }

    onSuccess?.()
    onClose?.()
  }

  return (
    <div className="consultation-form-overlay">
      <div
        className="consultation-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-form-title"
      >
        <div className="consultation-form-header">
          <div>
            <span className="dashboard-panel-eyebrow">
              EXPEDIENTE CLÍNICO
            </span>

            <h3 id="consultation-form-title">
              Nueva consulta
            </h3>

            <p>
              Registra la atención dermatológica del paciente.
            </p>
          </div>

          <button
            type="button"
            className="consultation-form-close"
            onClick={onClose}
            aria-label="Cerrar formulario"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="consultation-form-body">
            {error && (
              <p className="consultation-form-error" role="alert">
                {error}
              </p>
            )}

            <div className="consultation-form-grid">
              <div className="consultation-form-field">
                <label htmlFor="consultation-date">
                  Fecha de consulta *
                </label>

                <input
                  id="consultation-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="consultation-form-field">
                <label htmlFor="consultation-follow-up">
                  Próximo seguimiento
                </label>

                <input
                  id="consultation-follow-up"
                  type="date"
                  name="followUpDate"
                  min={form.date}
                  value={form.followUpDate}
                  onChange={handleChange}
                />
              </div>

              <div className="consultation-form-field consultation-form-full">
                <label htmlFor="consultation-reason">
                  Motivo de consulta *
                </label>

                <input
                  id="consultation-reason"
                  type="text"
                  name="reason"
                  maxLength={150}
                  placeholder="Ej. Seguimiento por acné facial"
                  value={form.reason}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="consultation-form-field consultation-form-full">
                <label htmlFor="consultation-diagnosis">
                  Diagnóstico *
                </label>

                <textarea
                  id="consultation-diagnosis"
                  name="diagnosis"
                  rows="3"
                  maxLength={1000}
                  placeholder="Describe el diagnóstico"
                  value={form.diagnosis}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="consultation-form-field consultation-form-full">
                <label htmlFor="consultation-treatment">
                  Tratamiento indicado
                </label>

                <textarea
                  id="consultation-treatment"
                  name="treatment"
                  rows="3"
                  maxLength={1500}
                  placeholder="Describe el tratamiento recomendado"
                  value={form.treatment}
                  onChange={handleChange}
                />
              </div>

              <div className="consultation-form-field consultation-form-full">
                <label htmlFor="consultation-observations">
                  Observaciones médicas
                </label>

                <textarea
                  id="consultation-observations"
                  name="observations"
                  rows="3"
                  maxLength={1500}
                  placeholder="Agrega observaciones sobre la evolución"
                  value={form.observations}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="consultation-form-actions">
            <button
              type="button"
              className="consultation-form-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="consultation-form-submit"
            >
              <Save size={17} />
              Guardar consulta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ConsultationForm