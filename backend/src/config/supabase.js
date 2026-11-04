import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.SUPABASE_URL
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Faltan las variables de Supabase en backend/.env')
}

if (!supabaseServiceRoleKey) {
  console.error('ERROR: Falta SUPABASE_SERVICE_ROLE_KEY en backend/.env, sin ella no se pueden administrar usuarios')
}

// Crea una conexión nueva cada vez para que no se mezclen las sesiones de distintos usuarios
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      flowType: 'implicit',
    },
  })
}

// Conexión con permisos completos, solo se usa aquí en el servidor y nunca en el frontend
export function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
