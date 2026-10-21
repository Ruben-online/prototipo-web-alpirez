# Dra. Marcela Alpírez

Aplicación web para la gestión de pacientes, consultas médicas y citas de un consultorio dermatológico.

El proyecto incluye una página pública informativa y un sistema administrativo desarrollado con React.

Actualmente, el frontend se encuentra implementado con datos de demostración. El backend y la base de datos serán desarrollados e integrados posteriormente por los integrantes responsables.

## Tecnologías utilizadas

### Frontend

- React 19
- Vite 8
- JavaScript
- React Router 7
- Lucide React
- CSS

### Backend

Pendiente de implementación.

La tecnología del servidor, la base de datos y la arquitectura de la API serán definidas por el equipo responsable del backend.

## Funcionalidades implementadas

### Landing page

Página pública del consultorio dermatológico.

Incluye:

- Barra de navegación.
- Sección principal de presentación.
- Información sobre la doctora.
- Servicios dermatológicos.
- Tratamientos.
- Testimonios.
- Información de contacto.
- Pie de página.

### Login

Interfaz de inicio de sesión para acceder al sistema administrativo.

Actualmente forma parte del prototipo frontend. La autenticación real está pendiente de integración con el backend.

### Dashboard general

Interfaz administrativa que permite visualizar información general del consultorio.

### Gestión de pacientes

Incluye interfaces para:

- Visualizar el listado de pacientes.
- Registrar pacientes.
- Editar información de pacientes.
- Consultar detalles individuales.
- Gestionar estados de pacientes.
- Visualizar antecedentes médicos.
- Consultar el historial de consultas.
- Registrar consultas médicas.

### Gestión de citas

Incluye interfaces para:

- Visualizar citas.
- Crear citas.
- Editar citas.
- Consultar detalles.
- Gestionar estados de citas.
- Registrar cancelaciones e inasistencias.
- Validar disponibilidad de horarios.

Estas funcionalidades corresponden al comportamiento implementado actualmente en el frontend.

## Estructura del proyecto

```text
prototipo-web-alpirez/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── appointments/
│   │   │   ├── landing/
│   │   │   └── patients/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── styles/
│   │   │   ├── appointments/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── landing/
│   │   │   └── patients/
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── vercel.json
│
├── backend/
│   └── README.md
│
├── .gitignore
└── README.md
```

## Organización del frontend

### components/

Contiene los componentes de React agrupados por funcionalidad.

- `landing/`: componentes de la página pública.
- `patients/`: componentes relacionados con pacientes y consultas.
- `appointments/`: componentes relacionados con citas.

### pages/

Contiene las páginas principales de la aplicación.

### layouts/

Contiene las estructuras compartidas utilizadas por las páginas administrativas.

### context/

Contiene los proveedores de React Context y las definiciones de los contextos.

Actualmente administran la información utilizada por los módulos de pacientes y citas.

### hooks/

Contiene los hooks personalizados que permiten acceder a los contextos.

- `usePatients.js`
- `useAppointments.js`

### styles/

Contiene los archivos CSS organizados por módulo.

### assets/

Contiene los recursos gráficos utilizados por la aplicación.

## Requisitos

Para ejecutar el frontend se necesita:

- Node.js compatible con Vite 8.
- npm.
- Git.

Se recomienda utilizar Node.js 20.19 o superior dentro de la rama 20, o Node.js 22.12 o superior.

## Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al directorio:

```bash
cd prototipo-web-alpirez
```

### 2. Entrar al frontend

```bash
cd frontend
```

### 3. Instalar dependencias

```bash
npm ci
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrir en el navegador la dirección indicada por Vite.

Normalmente:

http://localhost:5173/

## Comandos disponibles

Los siguientes comandos deben ejecutarse dentro de `frontend/`.

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

### Verificar el código con ESLint

```bash
npm run lint
```

### Generar una compilación de producción

```bash
npm run build
```

### Previsualizar la compilación

```bash
npm run preview
```

## Datos de demostración

Actualmente, el frontend utiliza información ficticia para demostrar el funcionamiento de pacientes, consultas y citas.

Esta información permite probar las interfaces sin depender de un backend.

La aplicación utiliza React Context para administrar los datos y mecanismos de almacenamiento local donde están implementados.

**Importante:**

- Los datos de demostración no constituyen una base de datos real.
- La información almacenada localmente no se comparte automáticamente entre dispositivos.
- El almacenamiento local no debe utilizarse para guardar información médica real.
- Los datos ficticios deberán revisarse durante la integración con el backend.

## Backend e integración

El desarrollo del backend está pendiente.

El equipo responsable deberá definir e implementar:

- API del sistema.
- Base de datos.
- Autenticación y autorización.
- Persistencia de pacientes.
- Persistencia de consultas médicas.
- Persistencia de citas.
- Validaciones del servidor.
- Medidas de seguridad para proteger los datos.

La integración deberá coordinarse con el frontend para conservar las funcionalidades y estructuras existentes.

Las decisiones sobre endpoints, autenticación y modelos de base de datos corresponden al equipo de backend.

## Estado actual

### Frontend

Implementado y funcional como prototipo con datos de demostración.

### Backend

Pendiente de desarrollo e integración.

### Base de datos

Pendiente de implementación.

## Colaboración

El proyecto se administra mediante Git y GitHub.

Se recomienda desarrollar los cambios en ramas independientes y revisarlos antes de integrarlos en `main`.

Antes de integrar cambios en el frontend, ejecutar:

```bash
npm run lint
npm run build
```

## Consideraciones de seguridad

El sistema está relacionado con la administración de información médica.

Durante el desarrollo deben utilizarse únicamente datos ficticios.

Antes de utilizar información real de pacientes será necesario implementar autenticación, autorización, almacenamiento seguro y los controles correspondientes en el backend.

## Proyecto

**Dra. Marcela Alpírez**

Sistema web para la administración de un consultorio dermatológico.