// ==========================================
// DERMO CLINI-K
// Configuración de ubicación y horarios
// ==========================================

export const locationHoursData = {
  clinic: {
    name: 'Dermo Clini-K',
    doctor: 'Dra. Marcela Alpírez',

    // Ubicación principal de la clínica
    building: 'Edificio Médico San Lucas',
    city: 'Quetzaltenango, Quetzaltenango',

    floor: 'Tercer nivel',
    office: 'Clínica 305',

    // Pendiente de confirmar con la doctora
    address: '',

    // Ubicación en Google Maps
    googleMapsUrl:
      'https://maps.app.goo.gl/bgD2teBXaDjRDBev7',

    // Coordenadas del edificio médico
    coordinates: {
      latitude: 14.8455184,
      longitude: -91.5150344,
    },
  },

  schedule: {
    confirmed: true,

    // Horarios organizados por ciudad
    locations: [
      {
        id: 'quetzaltenango',
        city: 'Quetzaltenango',
        days: [
          {
            day: 'Lunes, miércoles, jueves y viernes',
            hours: '9:00 a. m. – 6:00 p. m.',
          },
          {
            day: 'Sábados',
            hours: '8:00 a. m. – 12:00 p. m.',
          },
        ],
      },
      {
        id: 'mazatenango',
        city: 'Mazatenango',
        days: [
          {
            day: 'Martes',
            hours: '10:00 a. m. – 6:00 p. m.',
          },
        ],
      },
    ],

    // null = pendiente de confirmar
    // true = únicamente con cita previa
    // false = también sin cita previa
    appointmentOnly: null,

    pendingMessage:
      'Próximamente encontrarás aquí nuestros horarios de atención. Si deseas consultar disponibilidad, puedes comunicarte con nosotros.',
  },
}