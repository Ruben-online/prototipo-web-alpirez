/**
 * Validador de entrada para pre-citas siguiendo Single Responsibility Principle (SRP).
 */

// Utilidad para remover etiquetas HTML y scripts maliciosos para evitar inyecciones XSS
const sanitizeText = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .trim();
};

export const validatePreAppointment = (data) => {
  const errors = [];
  const { name, email, phone, message } = data;

  // 1. Nombre completo
  const cleanName = sanitizeText(name);
  if (!cleanName || cleanName.length === 0) {
    errors.push('El nombre es obligatorio.');
  } else if (cleanName.length < 3 || cleanName.length > 100) {
    errors.push('El nombre debe tener entre 3 y 100 caracteres.');
  }

  // 2. Correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push('Ingresa un correo electrónico válido.');
  }

  // 3. Teléfono (Requisito estricto: exactamente 8 dígitos numéricos)
  if (!phone || typeof phone !== 'string') {
    errors.push('El número de teléfono es obligatorio.');
  } else {
    // Normalizar eliminando todo lo que no sea dígito
    const cleanedPhone = phone.replace(/\D/g, '');
    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      errors.push('El número de teléfono debe contener exactamente 8 dígitos numéricos.');
    }
  }

  // 4. Mensaje / Motivo (Opcional pero si viene, validar longitud y sanitizar)
  const cleanMessage = sanitizeText(message);
  if (message && typeof message === 'string' && cleanMessage.length > 500) {
    errors.push('El mensaje o motivo de consulta no puede exceder los 500 caracteres.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      name: cleanName,
      email: email ? email.trim().toLowerCase() : '',
      phone: phone ? phone.replace(/\D/g, '') : '',
      message: cleanMessage
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
