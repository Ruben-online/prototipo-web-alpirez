import { Router } from 'express';
import { landingController } from '../controllers/landingController.js';
import { honeypotMiddleware } from '../middlewares/honeypot.js';
import { preAppointmentLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Endpoint consolidado (carga ultra rápida con 1 sola petición HTTP)
router.get('/all', landingController.getAll);

// Endpoints modulares específicos
router.get('/services', landingController.getServices);
router.get('/treatments', landingController.getTreatments);
router.get('/testimonials', landingController.getTestimonials);
router.get('/info', landingController.getClinicInfo);

// Envío de testimonios / feedback por pacientes (protegido con honeypot y rate limit)
router.post(
  '/testimonials',
  preAppointmentLimiter,
  honeypotMiddleware('_gotcha'),
  landingController.createTestimonial
);

export default router;
