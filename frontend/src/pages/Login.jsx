import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'

import AuthLayout from '../components/auth/AuthLayout'
import { useAuth } from '../hooks/useAuth'

function Login() {
  const { session, loading, login } = useAuth()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Mensaje que llega después de cambiar la contraseña
  const successMessage = location.state?.message

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password, remember)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  // Si ya tiene sesión abierta, lo manda directo al panel
  if (!loading && session) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AuthLayout>
      <div className="login-heading">
        <span className="login-eyebrow">
          ACCESO ADMINISTRATIVO
        </span>

        <h2>Bienvenido de nuevo.</h2>

        <p>
          Ingresa tus credenciales para acceder al panel de administración.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {successMessage && !error && (
          <p className="login-alert login-alert-success">
            {successMessage}
          </p>
        )}

        {error && (
          <p className="login-alert login-alert-error">
            {error}
          </p>
        )}

        <div className="login-field">
          <label htmlFor="email">
            Correo electrónico
          </label>

          <div className="login-input-wrapper">
            <Mail size={19} strokeWidth={1.8} />

            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="login-field">
          <div className="login-password-label">
            <label htmlFor="password">
              Contraseña
            </label>

            <Link to="/recuperar-contrasena" className="login-forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="login-input-wrapper">
            <LockKeyhole size={19} strokeWidth={1.8} />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="button"
              className="login-password-toggle"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword
                ? <EyeOff size={19} strokeWidth={1.8} />
                : <Eye size={19} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        <label className="login-remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          <span>Recordar sesión</span>
        </label>

        <button
          type="submit"
          className="login-submit"
          disabled={submitting}
        >
          <span>{submitting ? 'Ingresando...' : 'Iniciar sesión'}</span>
          <ArrowRight size={19} strokeWidth={1.8} />
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
