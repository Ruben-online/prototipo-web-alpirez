/**
 * Repositorio de Tratamientos (SRP & DIP)
 * Contiene el catálogo de condiciones dermatológicas tratadas.
 */
class TreatmentRepository {
  constructor() {
    this.treatments = [
      {
        id: '1',
        number: '01',
        title: 'Acné',
        description:
          'Tratamiento personalizado para controlar el acné y mejorar la salud y apariencia de la piel.',
        image:
          'https://static.wixstatic.com/media/a55bca_0fbb9e0054824178b7780071c1f21daa~mv2.png/v1/fill/w_980,h_980,al_c,q_90/a55bca_0fbb9e0054824178b7780071c1f21daa~mv2.png',
        active: true
      },
      {
        id: '2',
        number: '02',
        title: 'Manchas',
        description:
          'Opciones dermatológicas para tratar diferentes tipos de manchas y recuperar un tono más uniforme.',
        image:
          'https://static.wixstatic.com/media/e462eb_68b0ca67832b4ce5815a4a05511e6d8d~mv2.jpg/v1/fill/w_1000,h_667,al_c,q_85/e462eb_68b0ca67832b4ce5815a4a05511e6d8d~mv2.jpg',
        active: true
      },
      {
        id: '3',
        number: '03',
        title: 'Rejuvenecimiento',
        description:
          'Procedimientos orientados a mejorar la textura, luminosidad y apariencia general de la piel.',
        image:
          'https://static.wixstatic.com/media/722990_d47bcb42b0f94d248a6a7d81dade8493~mv2.png/v1/fill/w_720,h_500,al_c,q_85/722990_d47bcb42b0f94d248a6a7d81dade8493~mv2.png',
        active: true
      },
      {
        id: '4',
        number: '04',
        title: 'Caída del cabello',
        description:
          'Evaluación especializada para identificar las causas y establecer un tratamiento adecuado.',
        image:
          'https://www.myskinmyself.in/assets/images/Trichology%20treatment/2.%20Hair%20fall%20control.png',
        active: true
      }
    ];
  }

  async findAll() {
    return this.treatments.filter(t => t.active);
  }

  async findById(id) {
    return this.treatments.find(t => t.id === id) || null;
  }
}

export const treatmentRepository = new TreatmentRepository();

