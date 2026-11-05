import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Servidor Backend activo en http://localhost:${PORT}`);
  console.log(`Endpoint Auth:        http://localhost:${PORT}/api/auth`);
  console.log(`Endpoint Users:       http://localhost:${PORT}/api/users`);
  console.log(`Endpoint Pre-citas:   http://localhost:${PORT}/api/precitas`);
  console.log(`Endpoint Landing:     http://localhost:${PORT}/api/landing`);
  console.log(`Healthcheck:          http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
