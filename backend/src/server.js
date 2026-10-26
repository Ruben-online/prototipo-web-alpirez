import express from 'express'
import cors from 'cors'

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

// Encender el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`)
})
