import { apiRequest } from './api'

// Trae la lista de usuarios
export async function getUsers(token) {
  const data = await apiRequest('/api/users', { token })
  return data.users
}

// Crea un usuario con su rol y sus módulos
export async function createUser(token, user) {
  const data = await apiRequest('/api/users', {
    method: 'POST',
    body: user,
    token,
  })
  return data.user
}

// Guarda los cambios de nombre, rol o módulos
export async function updateUser(token, id, user) {
  const data = await apiRequest(`/api/users/${id}`, {
    method: 'PUT',
    body: user,
    token,
  })
  return data.user
}

// Activa o desactiva un usuario
export async function updateUserStatus(token, id, status) {
  const data = await apiRequest(`/api/users/${id}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  })
  return data.user
}
