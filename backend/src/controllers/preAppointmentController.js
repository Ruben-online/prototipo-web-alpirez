import { preAppointmentService } from '../services/preAppointmentService.js';

/**
 * Controlador de Pre-citas (Single Responsibility Principle).
 * Responsable únicamente del manejo de solicitudes y respuestas HTTP.
 */
export class PreAppointmentController {
  constructor(service = preAppointmentService) {
    this.service = service;
  }

  // POST /api/precitas
  create = async (req, res, next) => {
    try {
      // El middleware de validación ya sanitizó y validó los datos
      const data = req.validatedPreAppointment;
      const created = await this.service.createPreAppointment(data);

      return res.status(201).json({
        success: true,
        message: 'Tu solicitud de pre-cita ha sido enviada con éxito. La clínica se comunicará contigo para confirmar.',
        data: created
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/precitas (Soporta ?status=PENDING)
  getAll = async (req, res, next) => {
    try {
      const { status } = req.query;
      const items = await this.service.getAllPreAppointments(status);
      return res.status(200).json({
        success: true,
        total: items.length,
        data: items
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/precitas/:id
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.getPreAppointmentById(id);
      return res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };

  // PATCH /api/precitas/:id/status
  updateStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await this.service.updateStatus(id, status);
      return res.status(200).json({
        success: true,
        message: `Estado de la pre-cita actualizado a ${status}`,
        data: updated
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // DELETE /api/precitas/:id
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.service.deletePreAppointment(id);
      return res.status(200).json({
        success: true,
        message: 'Pre-cita eliminada correctamente.'
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };
}

export const preAppointmentController = new PreAppointmentController();
