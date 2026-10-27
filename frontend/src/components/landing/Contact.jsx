import { useState } from 'react'

function Contact({ info }) {
  const contactInfo = info?.contact || {
    email: 'contacto@clinicaalpirez.com',
    phone: '55550000',
    phoneDisplay: '+502 5555-0000',
    location: 'Quetzaltenango, Quetzaltenango'
  }

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    _gotcha: '' // Honeypot invisible para bots
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    // Si es teléfono, permitir estrictamente solo dígitos numéricos y un máximo de 8 dígitos
    if (name === 'phone') {
      const onlyDigits = value.replace(/\D/g, '').slice(0, 8)
      setForm((prev) => ({ ...prev, [name]: onlyDigits }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
    if (status.message) setStatus({ type: '', message: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    // Validación previa de 8 dígitos en cliente
    const cleanedPhone = form.phone.replace(/[\s-]/g, '')
    if (cleanedPhone.length !== 8) {
      setStatus({
        type: 'error',
        message: 'El número de teléfono debe tener exactamente 8 dígitos.'
      })
      setLoading(false)
      return
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/precitas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: cleanedPhone,
          message: form.message,
          _gotcha: form._gotcha
        })
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.errors ? data.errors.join(' ') : data.message || 'Error al enviar la solicitud.'
        setStatus({ type: 'error', message: errorMsg })
      } else {
        setStatus({
          type: 'success',
          message: data.message || '¡Tu solicitud ha sido recibida con éxito!'
        })
        setForm({
          name: '',
          email: '',
          phone: '',
          message: '',
          _gotcha: ''
        })
      }
    } catch (err) {
      console.error('Error enviando pre-cita:', err)
      setStatus({
        type: 'error',
        message: 'No pudimos conectar con el servidor. Intenta de nuevo más tarde.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contacto" className="contact">
      <div className="contact-container">

        <div className="contact-content">
          <div className="contact-content-inner">
            <span className="section-eyebrow">
              CONTACTO
            </span>

            <h2>
              Hablemos sobre
              <br />
              <span>tu piel.</span>
            </h2>

            <p>
              Agenda una pre-cita o escríbenos para obtener más
              información sobre nuestros servicios y tratamientos.
            </p>

            <div className="contact-details">

              <a
                href={`mailto:${contactInfo.email}`}
                className="contact-detail"
              >
                <div className="contact-detail-icon">
                  ✉
                </div>

                <div>
                  <span>Correo electrónico</span>
                  <strong>{contactInfo.email}</strong>
                </div>
              </a>

              <a
                href={`tel:+502${contactInfo.phone}`}
                className="contact-detail"
              >
                <div className="contact-detail-icon">
                  ☎
                </div>

                <div>
                  <span>Teléfono</span>
                  <strong>{contactInfo.phoneDisplay}</strong>
                </div>
              </a>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  ◉
                </div>

                <div>
                  <span>Ubicación</span>
                  <strong>{contactInfo.location}</strong>
                </div>
              </div>

            </div>

            <div className="contact-content-decoration">
              ✦
            </div>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-card-header">
            <span className="contact-card-label">
              SOLICITAR PRE-CITA
            </span>

            <span className="contact-card-icon">
              ✦
            </span>
          </div>

          <h3>
            ¿Te gustaría agendar
            <br />
            una consulta?
          </h3>

          <p>
            Déjanos tus datos de contacto y nos comunicaremos contigo
            para coordinar y confirmar tu cita.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>

            {/* Campo Honeypot para neutralizar bots (oculto visualmente) */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="gotcha-field">No llenar este campo</label>
              <input
                id="gotcha-field"
                type="text"
                name="_gotcha"
                tabIndex="-1"
                autoComplete="off"
                value={form._gotcha}
                onChange={handleChange}
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="name">
                Nombre completo *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Tu nombre y apellido"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="email">
                Correo electrónico *
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="phone">
                Teléfono (8 dígitos) *
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Ej. 55554444"
                maxLength="8"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="message">
                Motivo de consulta o mensaje
              </label>

              <textarea
                id="message"
                name="message"
                rows="3"
                placeholder="¿En qué podemos ayudarte o qué servicio te interesa?"
                value={form.message}
                onChange={handleChange}
              ></textarea>
            </div>

            {status.message && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  backgroundColor: status.type === 'error' ? '#fee2e2' : '#ecfdf5',
                  color: status.type === 'error' ? '#b91c1c' : '#047857',
                  border: `1px solid ${status.type === 'error' ? '#fca5a5' : '#a7f3d0'}`
                }}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              className="contact-submit"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Enviando...' : 'Solicitar pre-cita'}
              <span>→</span>
            </button>

          </form>
        </div>

      </div>
    </section>
  )
}

export default Contact
