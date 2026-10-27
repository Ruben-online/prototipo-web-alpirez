/**
 * Validador de entrada para pre-citas siguiendo Single Responsibility Principle (SRP).
 */
export const validatePreAppointment = (data) => {
  const errors = [];
  const { name, email, phone, message } = data;

  // 1. Nombre completo
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('El nombre es obligatorio.');
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    errors.push('El nombre debe tener entre 3 y 100 caracteres.');
  }

  // 2. Correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push('Ingresa un correo electrónico válido.');
  }

  // 3. Teléfono (Requisito estricto: exactamente 8 dígitos)
  if (!phone || typeof phone !== 'string') {
    errors.push('El número de teléfono es obligatorio.');
  } else {
    // Normalizar eliminando posibles guiones o espacios
    const cleanedPhone = phone.replace(/[\s-]/g, '');
    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      errors.push('El número de teléfono debe contener exactamente 8 dígitos numéricos.');
    }
  }

  // 4. Mensaje / Motivo (Opcional pero si viene, validar longitud)
  if (message && typeof message === 'string' && message.trim().length > 500) {
    errors.push('El mensaje o motivo de consulta no puede exceder los 500 caracteres.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      name: name ? name.trim() : '',
      email: email ? email.trim().toLowerCase() : '',
      phone: phone ? phone.replace(/[\s-]/g, '') : '',
      message: message ? message.trim() : ''
    }
  };
};

export const preAppointmentValidationMiddleware = (req, res, next) => {
  const { isValid, errors, sanitizedData } = validatePreAppointment(req.body);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación en los datos enviados.',
      errors
    });
  }

  req.validatedPreAppointment = sanitizedData;
  next();
};

