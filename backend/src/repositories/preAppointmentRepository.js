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

  async findAll(statusFilter = null) {
    let items = [...this.preAppointments];
    if (statusFilter) {
      items = items.filter(
        item => item.status.toUpperCase() === statusFilter.toUpperCase()
      );
    }
    // Retorna ordenado de la más reciente a la más antigua
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  async delete(id) {
    const index = this.preAppointments.findIndex(item => item.id === id);
    if (index === -1) return false;
    this.preAppointments.splice(index, 1);
    return true;
  }
}

// Singleton para compartir estado en memoria durante la ejecución del servidor
export const preAppointmentRepository = new PreAppointmentRepository();
