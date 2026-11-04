import crypto from 'crypto';

/**
 * Repositorio de Testimonios (SRP & DIP)
 * Contiene reseñas de pacientes con opción de destacar y registrar nuevas opiniones.
 */
class TestimonialRepository {
  constructor() {
    this.testimonials = [
      {
        id: '1',
        quote:
          'Desde mi primera consulta me sentí muy cómoda. La doctora explicó todo con mucha claridad y el tratamiento ha dado excelentes resultados.',
        name: 'María G.',
        treatment: 'Paciente de dermatología',
        rating: 5,
        featured: false,
        approved: true,
        createdAt: '2026-09-15T10:00:00.000Z'
      },
      {
        id: '2',
        quote:
          'Me gustó mucho la atención y el seguimiento durante mi tratamiento. Siempre sentí que mis dudas fueron escuchadas.',
        name: 'Andrea M.',
        treatment: 'Paciente de dermatología estética',
        rating: 5,
        featured: true,
        approved: true,
        createdAt: '2026-09-20T14:30:00.000Z'
      },
      {
        id: '3',
        quote:
          'Una experiencia excelente. La atención es profesional, cercana y se nota el cuidado por cada detalle.',
        name: 'Carolina R.',
        treatment: 'Paciente de consulta dermatológica',
        rating: 5,
        featured: false,
        approved: true,
        createdAt: '2026-10-02T09:15:00.000Z'
      }
    ];
  }

  async findAllApproved() {
    return this.testimonials.filter(t => t.approved);
  }

  async create(data) {
    const newTestimonial = {
      id: crypto.randomUUID(),
      quote: data.quote,
      name: data.name,
      treatment: data.treatment || 'Paciente del consultorio',
      rating: Number(data.rating) || 5,
      featured: false,
      approved: false, // Por moderación, queda pendiente de aprobación
      createdAt: new Date().toISOString()
    };
    this.testimonials.push(newTestimonial);
    return newTestimonial;
  }
}

export const testimonialRepository = new TestimonialRepository();

