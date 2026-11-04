import { UserRoundCheck, UserRoundX } from 'lucide-react'

// Pregunta antes de activar o desactivar un usuario
function UserStatusModal({ user, saving, onClose, onConfirm }) {
  if (!user) return null

  const isActive = user.status === 'Activo'

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
        className="users-modal users-modal-small"
        role="dialog"
        aria-modal="true"
        aria-labelledby="users-status-title"
      >

        <div className="users-modal-body users-status-body">

          <div className={`users-status-icon ${isActive ? 'deactivate' : 'activate'}`}>
            {isActive
              ? <UserRoundX size={24} strokeWidth={1.8} />
              : <UserRoundCheck size={24} strokeWidth={1.8} />}
          </div>

          <h3 id="users-status-title">
            {isActive ? 'Desactivar' : 'Activar'} a {user.fullName}
          </h3>

          <p>
            {isActive
              ? 'Ya no podrá iniciar sesión hasta que lo vuelvas a activar. Sus datos no se borran.'
              : 'Podrá volver a iniciar sesión con su correo y contraseña.'}
          </p>

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
            type="button"
            className={`dashboard-primary-button ${isActive ? 'users-danger-button' : ''}`}
            disabled={saving}
            onClick={onConfirm}
          >
            {saving ? 'Guardando...' : isActive ? 'Desactivar' : 'Activar'}
          </button>

        </div>

      </div>
    </div>
  )
}

export default UserStatusModal
