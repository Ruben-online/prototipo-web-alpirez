import { preAppointmentRepository } from '../repositories/preAppointmentRepository.js';

/**
 * Servicio de Pre-citas (Single Responsibility Principle).
 * Contiene la lógica de negocio independiente del protocolo de transporte (HTTP).
 */
export class PreAppointmentService {
  constructor(repository = preAppointmentRepository) {
    this.repository = repository;
  }

  async createPreAppointment(data) {
    // Aquí pueden añadirse reglas de negocio futuras (ej. notificaciones por correo/WhatsApp)
    return await this.repository.create(data);
  }

  async getAllPreAppointments() {
    return await this.repository.findAll();
  }

  async getPreAppointmentById(id) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error('Pre-cita no encontrada.');
    }
    return item;
  }

  async updateStatus(id, status) {
    const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Estado inválido. Estados permitidos: ${validStatuses.join(', ')}`);
    }

    const updated = await this.repository.updateStatus(id, status);
    if (!updated) {
      throw new Error('Pre-cita no encontrada para actualizar.');
    }
    return updated;
  }
}

export const preAppointmentService = new PreAppointmentService();

