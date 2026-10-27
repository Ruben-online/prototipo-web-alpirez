/**
 * Repositorio de Servicios (SRP & DIP)
 * Contiene los servicios dermatológicos ofrecidos por la clínica.
 */
class ServiceRepository {
  constructor() {
    this.services = [
      {
        id: '1',
        number: '01',
        title: 'Dermatología clínica',
        description:
          'Evaluación y tratamiento especializado para cuidar la salud de tu piel, cabello y uñas.',
        image:
          'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1000&q=85',
        active: true
      },
      {
        id: '2',
        number: '02',
        title: 'Dermatología estética',
        description:
          'Procedimientos diseñados para mejorar la apariencia de la piel de forma natural y personalizada.',
        image:
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=85',
        active: true
      },
      {
        id: '3',
        number: '03',
        title: 'Cuidado preventivo',
        description:
          'Valoración profesional y seguimiento para mantener una piel saludable a largo plazo.',
        image:
          'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=85',
        active: true
      }
    ];
  }

  async findAll() {
    return this.services.filter(s => s.active);
  }

  async findById(id) {
    return this.services.find(s => s.id === id) || null;
  }
}

export const serviceRepository = new ServiceRepository();

