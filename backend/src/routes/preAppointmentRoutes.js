import { Router } from 'express';
import { preAppointmentController } from '../controllers/preAppointmentController.js';
import { preAppointmentValidationMiddleware } from '../validators/preAppointmentValidator.js';
import { preAppointmentLimiter } from '../middlewares/rateLimiter.js';
import { honeypotMiddleware } from '../middlewares/honeypot.js';

const router = Router();

/**
 * Rutas públicas (Landing page):
 * - Rate limiting para evitar ataques de colapso / denegación de servicio.
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
 * - Consultar listado de pre-citas (con filtro opcional ?status=PENDING).
 * - Consultar detalle por ID.
 * - Actualizar estado a 'CONFIRMED' o 'REJECTED'.
 * - Eliminar o descartar pre-cita.
 */
router.get('/', preAppointmentController.getAll);
router.get('/:id', preAppointmentController.getById);
router.patch('/:id/status', preAppointmentController.updateStatus);
router.delete('/:id', preAppointmentController.delete);

export default router;
