import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'

import AuthLayout from '../components/auth/AuthLayout'
import { useAuth } from '../hooks/useAuth'

function ForgotPassword() {
  const { forgotPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      const data = await forgotPassword(email)
      setMessage(data.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="login-heading">
        <span className="login-eyebrow">
          RECUPERAR CONTRASEÑA
        </span>

        <h2>¿Olvidaste tu contraseña?</h2>

        <p>
          Escribe tu correo y te enviaremos un enlace para crear una nueva.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {message && (
          <p className="login-alert login-alert-success">
            {message}
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

        <button
          type="submit"
          className="login-submit"
          disabled={submitting}
        >
          <span>{submitting ? 'Enviando...' : 'Enviar enlace'}</span>
          <ArrowRight size={19} strokeWidth={1.8} />
        </button>

        <Link to="/login" className="login-secondary-link">
          <ArrowLeft size={16} strokeWidth={1.8} />
          Volver al inicio de sesión
        </Link>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
