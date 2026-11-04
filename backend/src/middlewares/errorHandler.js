/**
 * Middleware centralizado para manejo de errores imprevistos (SRP).
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[Error no controlado]:', err);

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor.';

  res.status(status).json({
    success: false,
    message
  });
};

