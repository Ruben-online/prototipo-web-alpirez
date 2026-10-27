import { Router } from 'express';
import { preAppointmentController } from '../controllers/preAppointmentController.js';
import { preAppointmentValidationMiddleware } from '../validators/preAppointmentValidator.js';
import { preAppointmentLimiter } from '../middlewares/rateLimiter.js';
import { honeypotMiddleware } from '../middlewares/honeypot.js';

const router = Router();

/**
 * Rutas públicas (Landing page):
 * - Rate limiting estricto para evitar ataques de colapso / denegación de servicio.
 * - Honeypot invisible para interceptar bots automatizados.
 * - Validación exhaustiva de campos y formato de 8 dígitos de teléfono.
 */
router.post(
  '/',
  preAppointmentLimiter,
  honeypotMiddleware('_gotcha'),
  preAppointmentValidationMiddleware,
  preAppointmentController.create
);

/**
 * Rutas administrativas (Dashboard):
 * - Consultar listado de pre-citas para revisión.
 * - Consultar una específica.
 * - Actualizar estado a 'CONFIRMED' o 'REJECTED'.
 */
router.get('/', preAppointmentController.getAll);
router.get('/:id', preAppointmentController.getById);
router.patch('/:id/status', preAppointmentController.updateStatus);

export default router;

