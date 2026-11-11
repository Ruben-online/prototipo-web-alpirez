/**
 * Honeypot anti-spam middleware.
 * Si el campo señuelo (invisible para humanos) contiene texto, se asume que es un bot.
 * Se responde con éxito aparente (200) para no alertar al bot mientras se descarta la acción.
 */
export const honeypotMiddleware = (field = '_gotcha') => {
  return (req, res, next) => {
    if (req.body && req.body[field] && req.body[field].trim() !== '') {
      console.warn(`[Anti-Spam] Bot detectado y bloqueado mediante honeypot desde IP: ${req.ip}`);
      return res.status(200).json({
        success: true,
        message: 'Solicitud procesada correctamente.'
      });
    }
    next();
  };
};

