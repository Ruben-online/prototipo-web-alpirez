import { Router } from 'express'
import { createAdminClient } from '../config/supabase.js'
import { MODULES, ROLES, USERS_MODULE } from '../config/permissions.js'
import { requireAuth } from '../middlewares/requireAuth.js'
import { requireAdmin } from '../middlewares/requireAdmin.js'
import { formatProfile } from '../services/profiles.js'

const router = Router()

// Todas estas rutas son solo para quien administra usuarios
router.use(requireAuth, requireAdmin)

const PROFILE_FIELDS = 'id, full_name, role, modules, status'

// Tiempo que dura bloqueada una cuenta desactivada (unos 100 años)
const BLOCKED_TIME = '876000h'

// Revisa el nombre, el rol y los módulos que manda el frontend
function validateProfileData({ fullName, role, modules }) {
  const name = typeof fullName === 'string' ? fullName.trim() : ''

  if (name.length < 3) {
    return { error: 'Ingresa el nombre completo' }
  }

  if (!ROLES.includes(role)) {
    return { error: 'Escoge un rol válido' }
  }

  if (!Array.isArray(modules)) {
    return { error: 'Escoge los módulos a los que tendrá acceso' }
  }

  // Solo se guardan los módulos que existen y sin repetir
  const cleanModules = MODULES.filter((module) => modules.includes(module))

  return { data: { full_name: name, role, modules: cleanModules } }
}

// Lista de todos los usuarios con su correo
router.get('/', async (req, res) => {
  const supabase = createAdminClient()

  const { data: rows, error } = await supabase
    .from('profiles')
    .select(PROFILE_FIELDS)
    .order('created_at')

  const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  })

  if (error || authError) {
    console.error('Error al cargar usuarios:', (error || authError).message)
    return res.status(500).json({ message: 'No se pudieron cargar los usuarios' })
  }

  const emails = new Map(authData.users.map((user) => [user.id, user.email]))

  res.json({
    users: rows.map((row) => ({
      ...formatProfile(row),
      email: emails.get(row.id) ?? '',
    })),
  })
})

// Crear un usuario nuevo con su rol y sus módulos
router.post('/', async (req, res) => {
  const { email, password } = req.body
  const { data: profile, error: validationError } = validateProfileData(req.body)

  if (validationError) {
    return res.status(400).json({ message: validationError })
  }

  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ message: 'Ingresa un correo válido' })
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' })
  }

  const supabase = createAdminClient()

  // Se crea la cuenta ya confirmada para que pueda entrar de una vez
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: cleanEmail,
    password,
    email_confirm: true,
  })

  if (createError) {
    if (createError.code === 'email_exists') {
      return res.status(409).json({ message: 'Ya existe un usuario con ese correo' })
    }

    console.error('Error al crear la cuenta:', createError.message)
    return res.status(500).json({ message: 'No se pudo crear el usuario, intenta de nuevo' })
  }

  const { data: row, error: profileError } = await supabase
    .from('profiles')
    .insert({ id: created.user.id, ...profile })
    .select(PROFILE_FIELDS)
    .single()

  // Si no se pudo guardar el perfil se borra la cuenta para no dejarla a medias
  if (profileError) {
    console.error('Error al guardar el perfil:', profileError.message)
    await supabase.auth.admin.deleteUser(created.user.id)
    return res.status(500).json({ message: 'No se pudo crear el usuario, intenta de nuevo' })
  }

  res.status(201).json({
    user: { ...formatProfile(row), email: cleanEmail },
  })
})

// Cambiar el nombre, el rol o los módulos de un usuario
router.put('/:id', async (req, res) => {
  const { data: profile, error: validationError } = validateProfileData(req.body)

  if (validationError) {
    return res.status(400).json({ message: validationError })
  }

  // Así el admin no se queda fuera de esta página por accidente
  if (req.params.id === req.user.id && !profile.modules.includes(USERS_MODULE)) {
    return res.status(400).json({ message: 'No puedes quitarte el acceso a Usuarios' })
  }

  const supabase = createAdminClient()

  const { data: row, error } = await supabase
    .from('profiles')
    .update({ ...profile, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select(PROFILE_FIELDS)
    .maybeSingle()

  if (error) {
    console.error('Error al editar el usuario:', error.message)
    return res.status(500).json({ message: 'No se pudo guardar los cambios, intenta de nuevo' })
  }

  if (!row) {
    return res.status(404).json({ message: 'No se encontró el usuario' })
  }

  res.json({ user: formatProfile(row) })
})

// Activar o desactivar un usuario
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body

  if (!['Activo', 'Inactivo'].includes(status)) {
    return res.status(400).json({ message: 'Estado no válido' })
  }

  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'No puedes desactivar tu propia cuenta' })
  }

  const supabase = createAdminClient()

  // Una cuenta desactivada queda bloqueada y ya no puede iniciar sesión
  const { error: blockError } = await supabase.auth.admin.updateUserById(req.params.id, {
    ban_duration: status === 'Inactivo' ? BLOCKED_TIME : 'none',
  })

  if (blockError) {
    console.error('Error al bloquear o desbloquear la cuenta:', blockError.message)
    return res.status(500).json({ message: 'No se pudo cambiar el estado, intenta de nuevo' })
  }

  const { data: row, error } = await supabase
    .from('profiles')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select(PROFILE_FIELDS)
    .maybeSingle()

  if (error || !row) {
    console.error('Error al cambiar el estado:', error?.message ?? 'perfil no encontrado')
    return res.status(500).json({ message: 'No se pudo cambiar el estado, intenta de nuevo' })
  }

  res.json({ user: formatProfile(row) })
})

export default router
