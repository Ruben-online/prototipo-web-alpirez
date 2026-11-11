import express from 'express'
import cors from 'cors'
import multer from 'multer'
import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import { processInventoryImport, processPatientsImport } from './importService.js'

const app = express()
const PORT = process.env.PORT || 3000

// Configurar multer en memoria para no saturar el disco
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Servidor API de la Clínica ejecutándose correctamente 🚀')
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)

// ==========================================
// RUTAS DE IMPORTACIÓN MASIVA
// ==========================================
app.post('/api/inventory/import', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo.' })
  try {
    const results = await processInventoryImport(req.file.buffer)
    res.json(results)
  } catch (error) {
    res.status(500).json({ error: 'Error procesando el archivo de inventario.' })
  }
})

app.post('/api/patients/import', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo.' })
  try {
    const results = await processPatientsImport(req.file.buffer)
    res.json(results)
  } catch (error) {
    res.status(500).json({ error: 'Error procesando el archivo de pacientes.' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`)
})