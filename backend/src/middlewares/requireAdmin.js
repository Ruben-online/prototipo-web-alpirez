import { USERS_MODULE } from '../config/permissions.js'
import { getProfile } from '../services/profiles.js'

// Solo deja pasar a quien tiene permiso para administrar usuarios (va después de requireAuth)
export async function requireAdmin(req, res, next) {
  let profile

  try {
    profile = await getProfile(req.user.id)
  } catch (error) {
    console.error('Error al revisar los permisos:', error.message)
    return res.status(500).json({ message: 'No se pudieron revisar tus permisos, intenta de nuevo' })
  }

  if (!profile || profile.status !== 'Activo' || !profile.modules.includes(USERS_MODULE)) {
    return res.status(403).json({ message: 'No tienes permiso para administrar usuarios' })
  }

  req.profile = profile
  next()
}
