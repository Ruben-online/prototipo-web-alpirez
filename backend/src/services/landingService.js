import { serviceRepository } from '../repositories/serviceRepository.js';
import { treatmentRepository } from '../repositories/treatmentRepository.js';
import { testimonialRepository } from '../repositories/testimonialRepository.js';
import { clinicInfoRepository } from '../repositories/clinicInfoRepository.js';

/**
 * Servicio de Landing Page (Single Responsibility Principle)
 * Consolida la lógica de negocio para la vista pública.
 */
export class LandingService {
  constructor(
    servicesRepo = serviceRepository,
    treatmentsRepo = treatmentRepository,
    testimonialsRepo = testimonialRepository,
    clinicInfoRepo = clinicInfoRepository
  ) {
    this.servicesRepo = servicesRepo;
    this.treatmentsRepo = treatmentsRepo;
    this.testimonialsRepo = testimonialsRepo;
    this.clinicInfoRepo = clinicInfoRepo;
  }

  async getServices() {
    return await this.servicesRepo.findAll();
  }

  async getTreatments() {
    return await this.treatmentsRepo.findAll();
  }

  async getTestimonials() {
    return await this.testimonialsRepo.findAllApproved();
  }

  async getClinicInfo() {
    return await this.clinicInfoRepo.getInfo();
  }

  async getAllLandingData() {
    const [services, treatments, testimonials, info] = await Promise.all([
      this.getServices(),
      this.getTreatments(),
      this.getTestimonials(),
      this.getClinicInfo()
    ]);

    return {
      services,
      treatments,
      testimonials,
      info
    };
  }

  async createTestimonial(data) {
    if (!data.name || !data.quote) {
      throw new Error('El nombre y el testimonio son obligatorios.');
    }
    return await this.testimonialsRepo.create(data);
  }
}

export const landingService = new LandingService();

