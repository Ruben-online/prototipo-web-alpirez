function Testimonials() {
  const testimonials = [
    {
      quote:
        'Desde mi primera consulta me sentí muy cómoda. La doctora explicó todo con mucha claridad y el tratamiento ha dado excelentes resultados.',
      name: 'María G.',
      treatment: 'Paciente de dermatología',
    },
    {
      quote:
        'Me gustó mucho la atención y el seguimiento durante mi tratamiento. Siempre sentí que mis dudas fueron escuchadas.',
      name: 'Andrea M.',
      treatment: 'Paciente de dermatología estética',
    },
    {
      quote:
        'Una experiencia excelente. La atención es profesional, cercana y se nota el cuidado por cada detalle.',
      name: 'Carolina R.',
      treatment: 'Paciente de consulta dermatológica',
    },
  ]

  return (
    <section className="testimonials">
      <div className="testimonials-container">

        <div className="testimonials-header">
          <span className="section-eyebrow">
            EXPERIENCIAS
          </span>

          <h2>
            Lo que dicen
            <br />
            <span>nuestros pacientes</span>
          </h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <article
              className={`testimonial-card ${
                index === 1 ? 'testimonial-card-featured' : ''
              }`}
              key={testimonial.name}
            >
              <div className="testimonial-stars">
                ★ ★ ★ ★ ★
              </div>

              <blockquote>
                “{testimonial.quote}”
              </blockquote>

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
          ))}
        </div>

      </div>
    </section>
  )
}

export default Testimonials