# Backend — Dra. Marcela Alpírez

API del proyecto hecha con Node.js + Express. Se conecta a Supabase para el inicio de sesión.

Por ahora el backend se encarga del login y de los usuarios con sus roles y permisos. Las consultas de pacientes y citas el frontend las hace directo a Supabase.

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

SUPABASE_SERVICE_ROLE_KEY=   (Supabase → Project Settings → API Keys)
```

La llave `SUPABASE_SERVICE_ROLE_KEY` da acceso a todo. Solo va en `backend/.env`, nunca en el frontend, en GitHub ni en el grupo.

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
| GET | `/api/auth/me` | Sí | Datos del usuario con sesión abierta, con su rol y sus módulos (`profile`) |
| POST | `/api/auth/forgot-password` | No | Envía el correo para cambiar la contraseña. Recibe `email` |
| POST | `/api/auth/reset-password` | Sí | Guarda la nueva contraseña. Recibe `password` (mínimo 8 caracteres) |
| GET | `/api/users` | Admin | Lista de usuarios con su rol, módulos y estado |
| POST | `/api/users` | Admin | Crea un usuario. Recibe `fullName`, `email`, `password`, `role` y `modules` |
| PUT | `/api/users/:id` | Admin | Cambia `fullName`, `role` y `modules` |
| PATCH | `/api/users/:id/status` | Admin | Activa o desactiva. Recibe `status` (`Activo` o `Inactivo`) |

"Admin" quiere decir que el usuario tiene el módulo `usuarios` en su perfil. Un usuario desactivado queda bloqueado y ya no puede iniciar sesión.

## Roles y permisos

Cada usuario tiene un perfil en la tabla `profiles` con su rol (`Admin`, `Doctora` o `Secretaria`) y los módulos a los que puede entrar: `pacientes`, `citas`, `inventario`, `reportes` y `usuarios`. El resumen lo ven todos.

El rol solo sirve para marcar los módulos de una vez, el admin los puede cambiar uno por uno desde la página de Usuarios.

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

Los usuarios se crean desde la página de **Usuarios** del panel. El primer admin se crea desde **Authentication → Users → Add user** y después se le agrega su perfil en la tabla `profiles`.
