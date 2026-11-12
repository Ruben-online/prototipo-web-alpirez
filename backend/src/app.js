import express from 'express';
import cors from 'cors';
import multer from 'multer';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import preAppointmentRoutes from './routes/preAppointmentRoutes.js';
import landingRoutes from './routes/landingRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { processInventoryImport, processPatientsImport } from './importService.js';

const app = express();

// Configurar multer en memoria para procesar Excel sin saturar el disco
const upload = multer({ storage: multer.memoryStorage() });

// Configuración de CORS
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
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

// Rutas de Autenticación y Usuarios
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Rutas de Pre-citas (Transaccional)
app.use('/api/precitas', preAppointmentRoutes);

// Rutas de Contenido de la Landing Page (Catálogos y Configuración)
app.use('/api/landing', landingRoutes);

// ==========================================
// RUTAS DE IMPORTACIÓN MASIVA (EXCEL)
// ==========================================
app.post('/api/inventory/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No se recibió ningún archivo.' });
  }
  try {
    const results = await processInventoryImport(req.file.buffer);
    res.json(results);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error procesando el archivo de inventario.' });
  }
});

app.post('/api/patients/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No se recibió ningún archivo.' });
  }
  try {
    const results = await processPatientsImport(req.file.buffer);
    res.json(results);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error procesando el archivo de pacientes.' });
  }
});

// Manejador de rutas no encontradas (siempre debe ir después de todas las rutas)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada.'
  });
});

// Manejador global de errores
app.use(errorHandler);

export default app;