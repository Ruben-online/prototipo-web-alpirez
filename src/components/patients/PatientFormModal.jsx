import {
  Pencil,
  Plus,
  UsersRound,
  X,
} from 'lucide-react'

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function getToday() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// ==========================================
// MODAL DE REGISTRO Y EDICIÓN
// ==========================================

function PatientFormModal({
  isOpen,
  isEditing,
  form,
  formError,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!isOpen) return null

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
        className="patients-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="patients-modal-title"
      >

        {/* ENCABEZADO DEL MODAL */}

        <div className="patients-modal-header">

          <div className="patients-modal-heading">

            <div className="patients-modal-icon">
              {isEditing ? (
                <Pencil size={21} strokeWidth={1.8} />
              ) : (
                <UsersRound size={21} strokeWidth={1.8} />
              )}
            </div>

            <div>
              <span className="dashboard-section-eyebrow">
                GESTIÓN DE PACIENTES
              </span>

              <h3 id="patients-modal-title">
                {isEditing
                  ? 'Editar paciente'
                  : 'Registrar nuevo paciente'}
              </h3>

              <p>
                {isEditing
                  ? 'Actualiza la información del paciente.'
                  : 'Completa los datos para crear su expediente.'}
              </p>
            </div>

          </div>

          <button
            type="button"
            className="patients-modal-close"
            aria-label="Cerrar formulario"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

        {/* FORMULARIO */}

        <form onSubmit={onSubmit}>

          <div className="patients-modal-body">

            <div className="patients-form-section">
              <span>INFORMACIÓN PERSONAL</span>

              <p>
                Los campos marcados con * son obligatorios.
              </p>
            </div>

            <div className="patients-form-grid">

              {/* NOMBRE */}

              <div className="patients-form-field patients-form-full">
                <label htmlFor="patient-name">
                  Nombre completo *
                </label>

                <input
                  id="patient-name"
                  name="name"
                  type="text"
                  placeholder="Ej. María Fernanda González"
                  value={form.name}
                  onChange={onChange}
                  maxLength={100}
                  autoFocus
                  required
                />
              </div>

              {/* FECHA DE NACIMIENTO */}

              <div className="patients-form-field">
                <label htmlFor="patient-birthdate">
                  Fecha de nacimiento *
                </label>

                <input
                  id="patient-birthdate"
                  name="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={onChange}
                  max={getToday()}
                  required
                />
              </div>

              {/* SEXO */}

              <div className="patients-form-field">
                <label htmlFor="patient-sex">
                  Sexo *
                </label>

                <select
                  id="patient-sex"
                  name="sex"
                  value={form.sex}
                  onChange={onChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                  <option value="Prefiere no indicar">
                    Prefiere no indicar
                  </option>
                </select>
              </div>

              {/* TELÉFONO */}

              <div className="patients-form-field">
                <label htmlFor="patient-phone">
                  Teléfono *
                </label>

                <input
                  id="patient-phone"
                  name="phone"
                  type="tel"
                  placeholder="Ej. 5555-1234"
                  value={form.phone}
                  onChange={onChange}
                  maxLength={20}
                  required
                />
              </div>

              {/* CORREO */}

              <div className="patients-form-field">
                <label htmlFor="patient-email">
                  Correo electrónico *
                </label>

                <input
                  id="patient-email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={form.email}
                  onChange={onChange}
                  maxLength={120}
                  required
                />
              </div>

              {/* DIRECCIÓN */}

              <div className="patients-form-field patients-form-full">
                <label htmlFor="patient-address">
                  Dirección
                </label>

                <textarea
                  id="patient-address"
                  name="address"
                  rows="3"
                  placeholder="Ej. Ciudad de Guatemala, zona 10"
                  value={form.address}
                  onChange={onChange}
                  maxLength={250}
                />
              </div>

            </div>

            {/* ERROR */}

            {formError && (
              <div className="patients-form-error" role="alert">
                {formError}
              </div>
            )}

            {/* NOTA */}

            <div className="patients-form-note">
              Este formulario es de demostración. Los cambios
              no se guardarán al recargar la página.
            </div>

          </div>

          {/* BOTONES DEL MODAL */}

          <div className="patients-modal-footer">

            <button
              type="button"
              className="patients-cancel-button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="dashboard-primary-button"
            >
              {isEditing ? (
                <>
                  <Pencil size={17} strokeWidth={1.8} />
                  Guardar cambios
                </>
              ) : (
                <>
                  <Plus size={17} strokeWidth={1.8} />
                  Registrar paciente
                </>
              )}
            </button>

          </div>

        </form>

      </div>
    </div>
  )
}

export default PatientFormModal