import { Router } from 'express';
import { landingController } from '../controllers/landingController.js';

const router = Router();

// Endpoint consolidado (carga ultra rápida con 1 sola petición HTTP)
router.get('/all', landingController.getAll);

// Endpoints modulares específicos
router.get('/services', landingController.getServices);
router.get('/treatments', landingController.getTreatments);
router.get('/testimonials', landingController.getTestimonials);
router.get('/info', landingController.getClinicInfo);

// Envío de testimonios / feedback por pacientes
router.post('/testimonials', landingController.createTestimonial);

export default router;

