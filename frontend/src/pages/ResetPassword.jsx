import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react'

import AuthLayout from '../components/auth/AuthLayout'
import { useAuth } from '../hooks/useAuth'

function ResetPassword() {
  const { session, loading, resetPassword } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setSubmitting(true)

    try {
      await resetPassword(password)
      navigate('/login', {
        replace: true,
        state: { message: 'Tu contraseña se cambió correctamente. Ya puedes iniciar sesión.' },
      })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (loading) {
    return null
  }

  // Sin sesión quiere decir que el enlace del correo no sirve o ya venció
  if (!session) {
    return (
      <AuthLayout>
        <div className="login-heading">
          <span className="login-eyebrow">
            ENLACE NO VÁLIDO
          </span>

          <h2>El enlace ya no funciona.</h2>

          <p>
            Puede que haya vencido o que ya se haya usado. Pide uno nuevo
            para cambiar tu contraseña.
          </p>
        </div>

        <Link to="/recuperar-contrasena" className="login-submit">
          <span>Pedir un nuevo enlace</span>
          <ArrowRight size={19} strokeWidth={1.8} />
        </Link>

        <Link to="/login" className="login-secondary-link">
          <ArrowLeft size={16} strokeWidth={1.8} />
          Volver al inicio de sesión
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="login-heading">
        <span className="login-eyebrow">
          NUEVA CONTRASEÑA
        </span>

        <h2>Crea tu nueva contraseña.</h2>

        <p>
          Debe tener al menos 8 caracteres.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && (
          <p className="login-alert login-alert-error">
            {error}
          </p>
        )}

        <div className="login-field">
          <label htmlFor="password">
            Nueva contraseña
          </label>

          <div className="login-input-wrapper">
            <LockKeyhole size={19} strokeWidth={1.8} />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu nueva contraseña"
              autoComplete="new-password"
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

        <div className="login-field">
          <label htmlFor="confirm-password">
            Confirmar contraseña
          </label>

          <div className="login-input-wrapper">
            <LockKeyhole size={19} strokeWidth={1.8} />

            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repite la contraseña"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="login-submit"
          disabled={submitting}
        >
          <span>{submitting ? 'Guardando...' : 'Guardar contraseña'}</span>
          <ArrowRight size={19} strokeWidth={1.8} />
        </button>
      </form>
    </AuthLayout>
  )
}

export default ResetPassword
