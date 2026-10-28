import { Router } from 'express'
import { createSupabaseClient } from '../config/supabase.js'

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

export default router
