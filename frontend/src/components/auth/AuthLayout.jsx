import { ArrowLeft } from 'lucide-react'

// Correo de soporte técnico (cambiar por el correo real)
const SUPPORT_EMAIL = 'soporte@clinicaalpirez.com'

// Diseño compartido del login, recuperar y cambiar contraseña
function AuthLayout({ children }) {
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

            {children}

            <div className="login-help">
              <span>¿Necesitas ayuda para ingresar?</span>
              <a href={`mailto:${SUPPORT_EMAIL}?subject=Ayuda para ingresar al sistema`}>
                Contactar soporte
              </a>
            </div>

          </div>
        </section>

      </div>
    </main>
  )
}

export default AuthLayout
