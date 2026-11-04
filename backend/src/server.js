import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'

const app = express()
const PORT = process.env.PORT || 3000

// Deja que el frontend se comunique con el servidor
app.use(cors({ origin: process.env.FRONTEND_URL }))

// Para poder leer los datos que manda el frontend
app.use(express.json())

// Ruta de prueba para ver si el servidor funciona
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Rutas del login
app.use('/api/auth', authRoutes)

// Rutas para administrar usuarios, roles y permisos
app.use('/api/users', usersRoutes)

// Encender el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`)
})
