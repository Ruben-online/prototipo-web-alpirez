import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Servidor Backend activo en puerto ${PORT}`);
  console.log(`Endpoint Pre-citas: http://localhost:${PORT}/api/precitas`);
  console.log(`Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});

