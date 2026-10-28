import { createSupabaseClient } from '../config/supabase.js'

// Solo deja pasar a los usuarios que mandan un token válido
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Debes iniciar sesión' })
  }

  const supabase = createSupabaseClient()
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ message: 'Tu sesión venció, vuelve a iniciar sesión' })
  }

  req.user = data.user
  req.token = token
  next()
}
