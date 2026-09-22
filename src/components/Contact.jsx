function Contact() {
  return (
    <section id="contacto" className="contact">
      <div className="contact-container">

        <div className="contact-content">
          <span className="section-eyebrow">
            CONTACTO
          </span>

          <h2>
            Hablemos sobre
            <br />
            <span>tu piel.</span>
          </h2>

          <p>
            Agenda una consulta o escríbenos para obtener más
            información sobre nuestros servicios y tratamientos.
          </p>

          <div className="contact-details">

            <div className="contact-detail">
              <div className="contact-detail-icon">
                ✉
              </div>

              <div>
                <span>Correo electrónico</span>
                <strong>contacto@clinicaalpirez.com</strong>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                ☎
              </div>

              <div>
                <span>Teléfono</span>
                <strong>+502 0000-0000</strong>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                ◉
              </div>

              <div>
                <span>Ubicación</span>
                <strong>Quetzaltenango, Quetzaltenango</strong>
              </div>
            </div>

          </div>
        </div>

        <div className="contact-card">
          <span className="contact-card-label">
            SOLICITA INFORMACIÓN
          </span>

          <h3>
            ¿Te gustaría agendar
            <br />
            una consulta?
          </h3>

          <p>
            Déjanos tus datos y nos pondremos en contacto contigo
            para brindarte más información.
          </p>

          <form className="contact-form">

            <div className="contact-form-group">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                placeholder="Tu nombre"
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                rows="4"
                placeholder="¿En qué podemos ayudarte?"
              ></textarea>
            </div>

            <button type="button" className="contact-submit">
              Enviar solicitud
              <span>→</span>
            </button>

          </form>
        </div>

      </div>
    </section>
  )
}

export default Contact