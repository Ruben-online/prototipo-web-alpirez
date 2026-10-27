import { landingService } from '../services/landingService.js';

/**
 * Controlador de la Landing Page (Single Responsibility Principle)
 * Expone los endpoints REST para consumo del frontend.
 */
export class LandingController {
  constructor(service = landingService) {
    this.service = service;
  }

  // GET /api/landing/all (Consolidado para carga inicial rápida)
  getAll = async (req, res, next) => {
    try {
      const data = await this.service.getAllLandingData();
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/landing/services
  getServices = async (req, res, next) => {
    try {
      const services = await this.service.getServices();
      return res.status(200).json({
        success: true,
        data: services
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/landing/treatments
  getTreatments = async (req, res, next) => {
    try {
      const treatments = await this.service.getTreatments();
      return res.status(200).json({
        success: true,
        data: treatments
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/landing/testimonials
  getTestimonials = async (req, res, next) => {
    try {
      const testimonials = await this.service.getTestimonials();
      return res.status(200).json({
        success: true,
        data: testimonials
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/landing/info
  getClinicInfo = async (req, res, next) => {
    try {
      const info = await this.service.getClinicInfo();
      return res.status(200).json({
        success: true,
        data: info
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/landing/testimonials (Opcional: envío de feedback por pacientes)
  createTestimonial = async (req, res, next) => {
    try {
      const created = await this.service.createTestimonial(req.body);
      return res.status(201).json({
        success: true,
        message: 'Gracias por compartir tu experiencia. Será revisada por la clínica antes de publicarse.',
        data: created
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
}

export const landingController = new LandingController();

