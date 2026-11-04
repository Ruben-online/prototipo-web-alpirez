import { createAdminClient } from '../config/supabase.js'

// Cambia los nombres de la base de datos a los que usa el frontend
export function formatProfile(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    role: row.role,
    modules: row.modules ?? [],
    status: row.status,
  }
}

// Busca el perfil de un usuario, devuelve null si no tiene
export async function getProfile(userId) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, modules, status')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? formatProfile(data) : null
}
