import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.SUPABASE_URL
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Faltan las variables de Supabase en backend/.env')
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
