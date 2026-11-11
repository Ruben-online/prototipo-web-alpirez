import rateLimit from 'express-rate-limit';

// Limitador para evitar flooding o ataques de denegación de servicio en pre-citas
// Permite configuración mediante variables de entorno (default: 30 solicitudes por 15 minutos)
const maxRequests = Number(process.env.RATE_LIMIT_MAX) || 30;

export const preAppointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Has alcanzado el límite de solicitudes de pre-citas. Por favor, intenta de nuevo más tarde o contáctanos por teléfono.'
  }
});
