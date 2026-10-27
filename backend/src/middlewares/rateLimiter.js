import rateLimit from 'express-rate-limit';

// Limitador estricto para evitar flooding o ataques de denegación de servicio en pre-citas
export const preAppointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 solicitudes por IP por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Has alcanzado el límite de solicitudes de pre-citas. Por favor, intenta de nuevo más tarde o contáctanos por teléfono.'
  }
});

