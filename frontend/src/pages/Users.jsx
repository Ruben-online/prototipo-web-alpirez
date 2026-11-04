import { useEffect, useState } from 'react'
import { Plus, UserRoundCheck, X } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import { ROLE_TEMPLATES } from '../constants/permissions'
import {
  createUser,
  getUsers,
  updateUser,
  updateUserStatus,
} from '../services/users'
import UsersTable from '../components/users/UsersTable'
import UserFormModal from '../components/users/UserFormModal'
import UserStatusModal from '../components/users/UserStatusModal'

import '../styles/users/users.css'

const emptyForm = {
  fullName: '',
  email: '',
  password: '',
  role: '',
  modules: [],
}

function Users() {
  const { session, user: currentUser, refreshProfile } = useAuth()
  const token = session?.access_token

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Formulario para crear o editar
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  // Usuario que se va a activar o desactivar
  const [userToToggle, setUserToToggle] = useState(null)

  const [successMessage, setSuccessMessage] = useState('')

  const isEditing = editingUserId !== null

  // Carga la lista de usuarios al abrir la página
  useEffect(() => {
    let cancelled = false

    const loadUsers = async () => {
      try {
        const list = await getUsers(token)
        if (!cancelled) setUsers(list)
      } catch (err) {
        if (!cancelled) setLoadError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadUsers()

    return () => {
      cancelled = true
    }
  }, [token])

  // El mensaje de éxito se quita solo después de unos segundos
  useEffect(() => {
    if (!successMessage) return

    const timeout = setTimeout(() => setSuccessMessage(''), 4000)
    return () => clearTimeout(timeout)
  }, [successMessage])

  // Con la tecla Escape se cierra la ventana abierta
  useEffect(() => {
    if (!modalOpen && !userToToggle) return

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !saving) {
        setModalOpen(false)
        setUserToToggle(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [modalOpen, userToToggle, saving])

  const openCreateModal = () => {
    setEditingUserId(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEditModal = (user) => {
    setEditingUserId(user.id)
    setForm({
      fullName: user.fullName,
      email: user.email,
      password: '',
      role: user.role,
      modules: user.modules,
    })
    setFormError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
    setFormError('')
  }

  // Al escoger un rol se marcan solos sus módulos
  const handleRoleChange = (role) => {
    setForm((previous) => {
      let modules = ROLE_TEMPLATES[role] ?? []

      // Si se está editando a sí mismo, no pierde el acceso a Usuarios
      if (editingUserId === currentUser?.id && !modules.includes('usuarios')) {
        modules = [...modules, 'usuarios']
      }

      return { ...previous, role, modules }
    })
    setFormError('')
  }

  const handleToggleModule = (moduleKey) => {
    setForm((previous) => ({
      ...previous,
      modules: previous.modules.includes(moduleKey)
        ? previous.modules.filter((key) => key !== moduleKey)
        : [...previous.modules, moduleKey],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const fullName = form.fullName.trim()

    if (fullName.length < 3) {
      setFormError('Ingresa el nombre completo.')
      return
    }

    if (!form.role) {
      setFormError('Escoge un rol.')
      return
    }

    if (!isEditing && form.password.length < 8) {
      setFormError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setSaving(true)

    try {
      if (isEditing) {
        const updated = await updateUser(token, editingUserId, {
          fullName,
          role: form.role,
          modules: form.modules,
        })

        setUsers((previous) =>
          previous.map((user) =>
            user.id === updated.id ? { ...user, ...updated } : user
          )
        )

        // Si se editó a sí mismo, se actualiza su nombre y su menú
        if (updated.id === currentUser?.id) {
          await refreshProfile()
        }

        setSuccessMessage(`Los cambios de ${fullName} se guardaron correctamente.`)
      } else {
        const created = await createUser(token, {
          fullName,
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: form.role,
          modules: form.modules,
        })

        setUsers((previous) => [...previous, created])
        setSuccessMessage(`${fullName} fue creado correctamente.`)
      }

      setModalOpen(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmToggleStatus = async () => {
    const isActive = userToToggle.status === 'Activo'

    setSaving(true)

    try {
      const updated = await updateUserStatus(
        token,
        userToToggle.id,
        isActive ? 'Inactivo' : 'Activo'
      )

      setUsers((previous) =>
        previous.map((user) =>
          user.id === updated.id ? { ...user, ...updated } : user
        )
      )

      setSuccessMessage(
        `${userToToggle.fullName} fue ${isActive ? 'desactivado' : 'activado'} correctamente.`
      )
      setUserToToggle(null)
    } catch (err) {
      setSuccessMessage('')
      setLoadError(err.message)
      setUserToToggle(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="users-page">

      <section className="users-heading">

        <div>
          <span className="dashboard-section-eyebrow">
            USUARIOS Y PERMISOS
          </span>

          <h2>Usuarios del sistema</h2>

          <p>
            Crea cuentas para tu equipo y escoge a qué módulos puede entrar cada uno.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-primary-button"
          onClick={openCreateModal}
        >
          <Plus size={18} strokeWidth={1.8} />
          <span>Nuevo usuario</span>
        </button>

      </section>

      {successMessage && (
        <div className="users-success" role="status">
          <UserRoundCheck size={18} strokeWidth={1.8} />
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

      {loadError && (
        <div className="users-error" role="alert">
          <span>{loadError}</span>

          <button
            type="button"
            aria-label="Cerrar mensaje"
            onClick={() => setLoadError('')}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <section className="users-directory">

        <div className="users-directory-header">

          <div>
            <span className="dashboard-panel-eyebrow">
              EQUIPO
            </span>

            <h3>Todos los usuarios</h3>

            <p>
              Edita su rol y sus módulos, o desactiva a quien ya no deba entrar.
            </p>
          </div>

          <span className="users-total-badge">
            {users.length} usuarios
          </span>

        </div>

        {loading && (
          <p className="users-empty">Cargando usuarios...</p>
        )}

        {!loading && users.length === 0 && !loadError && (
          <p className="users-empty">Todavía no hay usuarios registrados.</p>
        )}

        {!loading && users.length > 0 && (
          <UsersTable
            users={users}
            currentUserId={currentUser?.id}
            onEditUser={openEditModal}
            onToggleUserStatus={setUserToToggle}
          />
        )}

      </section>

      <UserFormModal
        isOpen={modalOpen}
        isEditing={isEditing}
        isCurrentUser={editingUserId === currentUser?.id}
        form={form}
        formError={formError}
        saving={saving}
        onClose={closeModal}
        onChange={handleFormChange}
        onRoleChange={handleRoleChange}
        onToggleModule={handleToggleModule}
        onSubmit={handleSubmit}
      />

      <UserStatusModal
        user={userToToggle}
        saving={saving}
        onClose={() => !saving && setUserToToggle(null)}
        onConfirm={confirmToggleStatus}
      />

    </div>
  )
}

export default Users
