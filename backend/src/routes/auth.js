import { Router } from 'express'
import {
  createSupabaseClient,
  supabaseUrl,
  supabaseAnonKey,
} from '../config/supabase.js'
import { requireAuth } from '../middlewares/requireAuth.js'

const router = Router()

// Iniciar sesión con correo y contraseña
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Ingresa tu correo y contraseña' })
  }

  const supabase = createSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return res.status(401).json({ message: 'Correo o contraseña incorrectos' })
  }

  res.json({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  })
})

// Datos del usuario que tiene la sesión abierta
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  })
})

// Enviar el correo para cambiar la contraseña
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Ingresa tu correo' })
  }

  const supabase = createSupabaseClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.FRONTEND_URL}/restablecer-contrasena`,
  })

  if (error) {
    console.error('Error al enviar el correo de recuperación:', error.message)
  }

  // Siempre se responde lo mismo para no revelar qué correos están registrados
  res.json({
    message: 'Si el correo está registrado, te llegará un enlace para cambiar tu contraseña',
  })
})

// Guardar la nueva contraseña (usa el token que llega en el enlace del correo)
router.post('/reset-password', requireAuth, async (req, res) => {
  const { password } = req.body

  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' })
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${req.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))

    if (data.error_code === 'same_password') {
      return res.status(400).json({ message: 'La nueva contraseña debe ser diferente a la anterior' })
    }

    return res.status(400).json({ message: 'No se pudo cambiar la contraseña, intenta de nuevo' })
  }

  res.json({ message: 'Contraseña actualizada' })
})

export default router
