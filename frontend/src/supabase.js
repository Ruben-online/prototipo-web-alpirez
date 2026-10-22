import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si faltan las llaves, devolvemos un proxy que avise del error
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: No se encontraron las variables de entorno en frontend/.env')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder')