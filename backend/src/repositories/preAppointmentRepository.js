import crypto from 'crypto';

/**
 * Interface / Clase Repositorio en memoria para Pre-citas (DIP y SRP).
 * Permite cambiar la persistencia a base de datos (Supabase / PostgreSQL)
 * sin modificar la lógica de los servicios ni de los controladores.
 */
class PreAppointmentRepository {
  constructor() {
    this.preAppointments = [];
  }

  async create(data) {
    const preAppointment = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message || '',
      status: 'PENDING', // PENDING, CONFIRMED, REJECTED
      createdAt: new Date().toISOString()
    };

    this.preAppointments.push(preAppointment);
    return preAppointment;
  }

  async findAll() {
    // Retorna ordenado de la más reciente a la más antigua
    return [...this.preAppointments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findById(id) {
    return this.preAppointments.find(item => item.id === id) || null;
  }

  async updateStatus(id, newStatus) {
    const item = await this.findById(id);
    if (!item) return null;
    item.status = newStatus;
    item.updatedAt = new Date().toISOString();
    return item;
  }
}

// Singleton para compartir estado en memoria durante la ejecución del servidor
export const preAppointmentRepository = new PreAppointmentRepository();

