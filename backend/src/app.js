import express from 'express';
import cors from 'cors';
import preAppointmentRoutes from './routes/preAppointmentRoutes.js';
import landingRoutes from './routes/landingRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Configuración de CORS
app.use(cors({
  origin: '*', // Permitir peticiones desde el frontend de desarrollo y producción
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS']
}));

// Parseo de cuerpo JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de verificación de estado (Healthcheck)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Dra. Marcela Alpírez - Backend API',
    timestamp: new Date().toISOString()
  });
});

// Rutas de Pre-citas (Transaccional)
app.use('/api/precitas', preAppointmentRoutes);

// Rutas de Contenido de la Landing Page (Catálogos y Configuración)
app.use('/api/landing', landingRoutes);

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada.'
  });
});

// Manejador global de errores
app.use(errorHandler);

export default app;
