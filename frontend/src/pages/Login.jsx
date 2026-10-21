import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, LockKeyhole, Mail } from 'lucide-react'

function Login() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    // Autenticación simulada por ahora.
    // Más adelante aquí conectaremos el login real con JWT.
    navigate('/dashboard')
  }

  return (
    <main className="login-page">
      <div className="login-container">

        <section className="login-brand-panel">
          <div className="login-brand-decoration login-brand-decoration-one"></div>
          <div className="login-brand-decoration login-brand-decoration-two"></div>

          <a href="/" className="login-back-link">
            <ArrowLeft size={17} strokeWidth={1.8} />
            Volver al sitio
          </a>

          <div className="login-brand-content">
            <div className="login-brand-mark">
              <span>DA</span>
            </div>

            <span className="login-brand-eyebrow">
              DRA. ALPÍREZ
            </span>

            <h1>
              El cuidado de tus pacientes,
              <span> en un solo lugar.</span>
            </h1>

            <p>
              Accede al panel administrativo para gestionar pacientes,
              citas, inventario y la operación diaria de la clínica.
            </p>
          </div>

          <div className="login-brand-footer">
            <span className="login-brand-footer-icon">✦</span>

            <div>
              <strong>Dermatología integral</strong>
              <span>Salud, belleza y bienestar</span>
            </div>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-wrapper">

            <div className="login-mobile-brand">
              <div className="login-brand-mark">
                <span>DA</span>
              </div>

              <span>DRA. ALPÍREZ</span>
            </div>

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
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <div className="login-password-label">
                  <label htmlFor="password">
                    Contraseña
                  </label>

                  <button type="button" className="login-forgot-password">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="login-input-wrapper">
                  <LockKeyhole size={19} strokeWidth={1.8} />

                  <input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    required
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    aria-label="Mostrar contraseña"
                  >
                    <Eye size={19} strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              <label className="login-remember">
                <input type="checkbox" />
                <span>Recordar sesión</span>
              </label>

              <button type="submit" className="login-submit">
                <span>Iniciar sesión</span>
                <ArrowRight size={19} strokeWidth={1.8} />
              </button>
            </form>

            <div className="login-help">
              <span>¿Necesitas ayuda para ingresar?</span>
              <a href="#contacto">Contactar soporte</a>
            </div>

          </div>
        </section>

      </div>
    </main>
  )
}

export default Login