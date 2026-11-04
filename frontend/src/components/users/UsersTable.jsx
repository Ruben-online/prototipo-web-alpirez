import { Pencil, UserRoundCheck, UserRoundX } from 'lucide-react'
import { MODULES } from '../../constants/permissions'

// Saca las iniciales del nombre para el círculo de la foto
function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

// Tabla con todos los usuarios, su rol y sus módulos
function UsersTable({ users, currentUserId, onEditUser, onToggleUserStatus }) {
  return (
    <div className="users-table-wrapper">

      <table className="users-table">

        <thead>
          <tr>
            <th>USUARIO</th>
            <th>ROL</th>
            <th>MÓDULOS</th>
            <th>ESTADO</th>
            <th>ACCIONES</th>
          </tr>
        </thead>

        <tbody>

          {users.map((user) => {
            const isActive = user.status === 'Activo'
            const isCurrentUser = user.id === currentUserId

            return (
              <tr key={user.id}>

                <td>
                  <div className="users-person">

                    <div className="users-avatar">
                      {getInitials(user.fullName)}
                    </div>

                    <div className="users-person-info">
                      <strong>
                        {user.fullName}
                        {isCurrentUser && <small> (tú)</small>}
                      </strong>
                      <span>{user.email}</span>
                    </div>

                  </div>
                </td>

                <td>
                  <span className="users-role">{user.role}</span>
                </td>

                <td>
                  <div className="users-modules">
                    {user.modules.length === 0 && (
                      <span className="users-no-modules">Solo resumen</span>
                    )}

                    {MODULES
                      .filter((module) => user.modules.includes(module.key))
                      .map((module) => (
                        <span key={module.key} className="users-module-chip">
                          {module.label}
                        </span>
                      ))}
                  </div>
                </td>

                <td>
                  <span className={`users-status ${isActive ? 'active' : 'inactive'}`}>
                    <span className="users-status-dot" />
                    {user.status}
                  </span>
                </td>

                <td>
                  <div className="users-row-actions">

                    <button
                      type="button"
                      className="users-icon-button"
                      title={`Editar a ${user.fullName}`}
                      aria-label={`Editar a ${user.fullName}`}
                      onClick={() => onEditUser(user)}
                    >
                      <Pencil size={15} strokeWidth={1.8} />
                    </button>

                    {/* Nadie se puede desactivar a sí mismo */}
                    <button
                      type="button"
                      className={`users-icon-button ${isActive ? 'deactivate' : 'activate'}`}
                      title={
                        isCurrentUser
                          ? 'No puedes desactivar tu propia cuenta'
                          : `${isActive ? 'Desactivar' : 'Activar'} a ${user.fullName}`
                      }
                      aria-label={`${isActive ? 'Desactivar' : 'Activar'} a ${user.fullName}`}
                      disabled={isCurrentUser}
                      onClick={() => onToggleUserStatus(user)}
                    >
                      {isActive
                        ? <UserRoundX size={15} strokeWidth={1.8} />
                        : <UserRoundCheck size={15} strokeWidth={1.8} />}
                    </button>

                  </div>
                </td>

              </tr>
            )
          })}

        </tbody>

      </table>

    </div>
  )
}

export default UsersTable
