const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Hace una petición al backend y devuelve la respuesta
export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Ocurrió un error, intenta de nuevo')
  }

  return data
}
