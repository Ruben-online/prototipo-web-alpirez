function Testimonials({ testimonialsData }) {
  const defaultTestimonials = [
    {
      quote:
        'Desde mi primera consulta me sentí muy cómoda. La doctora explicó todo con mucha claridad y el tratamiento ha dado excelentes resultados.',
      name: 'María G.',
      treatment: 'Paciente de dermatología',
      featured: false
    },
    {
      quote:
        'Me gustó mucho la atención y el seguimiento durante mi tratamiento. Siempre sentí que mis dudas fueron escuchadas.',
      name: 'Andrea M.',
      treatment: 'Paciente de dermatología estética',
      featured: true
    },
    {
      quote:
        'Una experiencia excelente. La atención es profesional, cercana y se nota el cuidado por cada detalle.',
      name: 'Carolina R.',
      treatment: 'Paciente de consulta dermatológica',
      featured: false
    },
  ]

  const testimonials =
    testimonialsData && testimonialsData.length > 0 ? testimonialsData : defaultTestimonials

  return (
    <section className="testimonials">
      <div className="testimonials-container">

        <div className="testimonials-header">
          <div>
            <span className="section-eyebrow">
              EXPERIENCIAS
            </span>

            <h2>
              Lo que dicen
              <br />
              <span>nuestros pacientes</span>
            </h2>
          </div>

          <p>
            La confianza de nuestros pacientes refleja una atención
            cercana, profesional y enfocada en acompañar cada proceso
            de manera personalizada.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => {
            const isFeatured = testimonial.featured || index === 1
            return (
              <article
                className={`testimonial-card ${
                  isFeatured ? 'testimonial-card-featured' : ''
                }`}
                key={testimonial.id || testimonial.name}
              >
                <div className="testimonial-card-top">
                  <div className="testimonial-stars">
                    ★ ★ ★ ★ ★
                  </div>

                  <span className="testimonial-quote-icon">
                    “
                  </span>
                </div>

                {isFeatured && (
                  <span className="testimonial-featured-label">
                    EXPERIENCIA DESTACADA
                  </span>
                )}

                <blockquote>
                  {testimonial.quote}
                </blockquote>

                <div className="testimonial-divider"></div>

                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>

                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.treatment}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default Testimonials
