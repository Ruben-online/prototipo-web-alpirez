# Backend — Dra. Marcela Alpírez

API del proyecto hecha con Node.js + Express. Se conecta a Supabase para el inicio de sesión.

Por ahora el backend se encarga del login. Las consultas de pacientes y citas el frontend las hace directo a Supabase.

## Instalación

Dentro de la carpeta `backend/`:

```bash
npm ci
```

Crear el archivo `.env` copiando `.env.example` y llenar los valores:

```text
PORT=3000
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=        (el mismo valor de VITE_SUPABASE_URL del frontend)
SUPABASE_ANON_KEY=   (el mismo valor de VITE_SUPABASE_ANON_KEY del frontend)
```

## Comandos

```bash
npm run dev     # se reinicia solo al guardar cambios
npm start
```

El servidor queda en `http://localhost:3000`.

## Rutas

| Método | Ruta | Necesita sesión | Qué hace |
|---|---|---|---|
| GET | `/api/health` | No | Ver si el servidor está encendido |
| POST | `/api/auth/login` | No | Iniciar sesión. Recibe `email` y `password`, devuelve `accessToken` (JWT) y `refreshToken` |
| GET | `/api/auth/me` | Sí | Datos del usuario con sesión abierta |
| POST | `/api/auth/forgot-password` | No | Envía el correo para cambiar la contraseña. Recibe `email` |
| POST | `/api/auth/reset-password` | Sí | Guarda la nueva contraseña. Recibe `password` (mínimo 8 caracteres) |

Las rutas que necesitan sesión piden el token en el encabezado:

```text
Authorization: Bearer <accessToken>
```

Para proteger una ruta nueva se usa `requireAuth`:

```js
import { requireAuth } from '../middlewares/requireAuth.js'

router.get('/mi-ruta', requireAuth, (req, res) => {
  // req.user tiene los datos del usuario
})
```

## Configuración en Supabase

Para que funcione el enlace de "¿Olvidaste tu contraseña?", en **Authentication → URL Configuration** hay que agregar en **Redirect URLs**:

```text
http://localhost:5173/restablecer-contrasena
```

Y la dirección de producción cuando esté publicada.

Los usuarios se crean desde **Authentication → Users → Add user**.
