// ==========================================
// DERMO CLINI-K
// Configuración de ubicación y horarios
// ==========================================

export const locationHoursData = {
  clinic: {
    name: 'Dermo Clini-K',
    doctor: 'Dra. Marcela Alpírez',

    // Ubicación de la clínica
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
    // Cambiar a true cuando se confirmen
    // todos los horarios de atención.
    confirmed: false,

    days: [
      { day: 'Lunes', hours: '' },
      { day: 'Martes', hours: '' },
      { day: 'Miércoles', hours: '' },
      { day: 'Jueves', hours: '' },
      { day: 'Viernes', hours: '' },
      { day: 'Sábado', hours: '' },
      { day: 'Domingo', hours: '' },
    ],

    // null = pendiente de confirmar
    // true = únicamente con cita previa
    // false = también sin cita previa
    appointmentOnly: null,

    pendingMessage:
      'Próximamente encontrarás aquí nuestros horarios de atención. Si deseas consultar disponibilidad, puedes comunicarte con nosotros.',
  },
}