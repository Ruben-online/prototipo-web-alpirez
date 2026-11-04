import { Pencil, UserRoundPlus, X } from 'lucide-react'
import { MODULES, ROLES } from '../../constants/permissions'

// Formulario para crear o editar un usuario y escoger sus módulos
function UserFormModal({
  isOpen,
  isEditing,
  isCurrentUser,
  form,
  formError,
  saving,
  onClose,
  onChange,
  onRoleChange,
  onToggleModule,
  onSubmit,
}) {
  if (!isOpen) return null

  return (
    <div
      className="users-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="users-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="users-modal-title"
      >

        <div className="users-modal-header">

          <div className="users-modal-heading">

            <div className="users-modal-icon">
              {isEditing
                ? <Pencil size={21} strokeWidth={1.8} />
                : <UserRoundPlus size={21} strokeWidth={1.8} />}
            </div>

            <div>
              <span className="dashboard-section-eyebrow">
                USUARIOS Y PERMISOS
              </span>

              <h3 id="users-modal-title">
                {isEditing ? 'Editar usuario' : 'Nuevo usuario'}
              </h3>

              <p>
                {isEditing
                  ? 'Cambia su rol o los módulos a los que puede entrar.'
                  : 'Crea la cuenta y escoge a qué módulos puede entrar.'}
              </p>
            </div>

          </div>

          <button
            type="button"
            className="users-modal-close"
            aria-label="Cerrar formulario"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </div>

        <form onSubmit={onSubmit}>

          <div className="users-modal-body">

            <div className="users-form-section">
              <span>DATOS DE LA CUENTA</span>
              <p>Los campos marcados con * son obligatorios.</p>
            </div>

            <div className="users-form-grid">

              <div className="users-form-field users-form-full">
                <label htmlFor="user-name">Nombre completo *</label>

                <input
                  id="user-name"
                  name="fullName"
                  type="text"
                  placeholder="Ej. Ana Lucía Pérez"
                  value={form.fullName}
                  onChange={onChange}
                  maxLength={100}
                  autoFocus
                  required
                />
              </div>

              <div className="users-form-field">
                <label htmlFor="user-email">Correo electrónico *</label>

                {/* El correo no se cambia después de crear la cuenta */}
                <input
                  id="user-email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={form.email}
                  onChange={onChange}
                  disabled={isEditing}
                  required={!isEditing}
                />
              </div>

              {!isEditing && (
                <div className="users-form-field">
                  <label htmlFor="user-password">Contraseña temporal *</label>

                  <input
                    id="user-password"
                    name="password"
                    type="text"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={onChange}
                    minLength={8}
                    required
                  />
                </div>
              )}

              <div className="users-form-field users-form-full">
                <label htmlFor="user-role">Rol *</label>

                <select
                  id="user-role"
                  name="role"
                  value={form.role}
                  onChange={(event) => onRoleChange(event.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="users-form-section users-form-section-spaced">
              <span>MÓDULOS PERMITIDOS</span>
              <p>
                Al escoger el rol se marcan solos, pero puedes cambiarlos.
                El resumen lo ven todos.
              </p>
            </div>

            <div className="users-modules-grid">
              {MODULES.map((module) => {
                // El admin no se puede quitar a sí mismo el acceso a Usuarios
                const locked = isCurrentUser && module.key === 'usuarios'

                return (
                  <label
                    key={module.key}
                    className={`users-module-option ${
                      form.modules.includes(module.key) ? 'checked' : ''
                    } ${locked ? 'locked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={form.modules.includes(module.key)}
                      onChange={() => onToggleModule(module.key)}
                      disabled={locked}
                    />
                    <span>{module.label}</span>
                  </label>
                )
              })}
            </div>

            {!isEditing && (
              <p className="users-form-note">
                Pásale al usuario su correo y esta contraseña temporal. Puede
                cambiarla cuando quiera con "¿Olvidaste tu contraseña?".
              </p>
            )}

            {formError && (
              <p className="users-form-error" role="alert">
                {formError}
              </p>
            )}

          </div>

          <div className="users-modal-footer">

            <button
              type="button"
              className="users-cancel-button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="dashboard-primary-button"
              disabled={saving}
            >
              {saving
                ? 'Guardando...'
                : isEditing ? 'Guardar cambios' : 'Crear usuario'}
            </button>

          </div>

        </form>

      </div>
    </div>
  )
}

export default UserFormModal
