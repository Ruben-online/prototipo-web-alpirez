/**
 * Repositorio de Configuración e Información Institucional de la Clínica (SRP & DIP)
 */
class ClinicInfoRepository {
  constructor() {
    this.clinicInfo = {
      name: 'Clínica Dermatológica Dra. Marcela Alpírez',
      doctor: {
        title: 'Dra. Marcela Alpírez',
        specialty: 'Dermatología clínica y estética',
        experienceYears: 10,
        bioP1:
          'La Dra. Alpírez es especialista en dermatología, comprometida con brindar una atención cercana, profesional y personalizada a cada paciente.',
        bioP2:
          'Su enfoque combina conocimiento médico, tecnología y una visión integral de la salud de la piel para desarrollar tratamientos adaptados a las necesidades de cada persona.',
        highlights: [
          {
            title: 'Atención personalizada',
            description: 'Cada paciente recibe un enfoque individual.'
          },
          {
            title: 'Enfoque profesional',
            description: 'Tratamientos basados en valoración especializada.'
          }
        ]
      },
      hero: {
        eyebrow: 'DERMATOLOGÍA CLÍNICA Y ESTÉTICA',
        titleMain: 'Cuida tu piel.',
        titleAccent: 'Realza tu belleza.',
        description:
          'Atención dermatológica personalizada con un enfoque profesional, cercano y pensado para el bienestar de tu piel.',
        stats: [
          { value: '+10', label: 'Años de experiencia' },
          { value: '100%', label: 'Atención personalizada' }
        ]
      },
      contact: {
        email: 'contacto@clinicaalpirez.com',
        phone: '55550000', // Teléfono formato 8 dígitos
        phoneDisplay: '+502 5555-0000',
        location: 'Quetzaltenango, Quetzaltenango',
        schedule: 'Lunes a Viernes de 08:00 a 18:00'
      },
      social: {
        instagram: 'https://instagram.com/clinicaalpirez',
        facebook: 'https://facebook.com/clinicaalpirez'
      }
    };
  }

  async getInfo() {
    return this.clinicInfo;
  }
}

export const clinicInfoRepository = new ClinicInfoRepository();

