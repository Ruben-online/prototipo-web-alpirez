import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import { supabase } from '../supabase'
import { apiRequest } from '../services/api'

const REMEMBER_KEY = 'alpirez-remember'
const ACTIVE_COOKIE = 'alpirez-active'

// Revisa si el navegador sigue abierto desde que se inició sesión
const isBrowserOpenSinceLogin = () =>
  document.cookie.includes(`${ACTIVE_COOKIE}=1`)

// Esta cookie se borra sola al cerrar el navegador
const markBrowserOpen = () => {
  document.cookie = `${ACTIVE_COOKIE}=1; path=/; SameSite=Lax`
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      let currentSession = data.session

      // Si no marcó "Recordar sesión" y cerró el navegador, se cierra la sesión
      const remember = localStorage.getItem(REMEMBER_KEY) !== 'false'
      const isResetPage = window.location.pathname === '/restablecer-contrasena'

      if (currentSession && !remember && !isBrowserOpenSinceLogin() && !isResetPage) {
        await supabase.auth.signOut({ scope: 'local' })
        currentSession = null
      }

      setSession(currentSession)
      setLoading(false)
    }

    loadSession()

    // Se actualiza cuando la sesión se abre, se cierra o se renueva
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const login = async (email, password, remember) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })

    localStorage.setItem(REMEMBER_KEY, String(remember))
    markBrowserOpen()

    // Se guarda la sesión para que las consultas a Supabase vayan con el usuario
    const { error } = await supabase.auth.setSession({
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
    })

    if (error) {
      throw new Error('No se pudo iniciar sesión, intenta de nuevo')
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const forgotPassword = (email) => {
    return apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: { email },
    })
  }

  const resetPassword = async (password) => {
    await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { password },
      token: session?.access_token,
    })

    // Después de cambiarla tiene que entrar de nuevo con la contraseña nueva
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        login,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
