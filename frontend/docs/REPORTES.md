# Módulo de Reportes — Dra. Marcela Alpírez

## 1. Descripción general

El módulo de Reportes permite consultar información administrativa
de la clínica mediante filtros, vistas previas y exportación de
documentos en PDF y Excel (.xlsx).

El desarrollo se realizó desde el frontend, reutilizando los datos
que proporcionan los módulos existentes.

## 2. Tecnologías utilizadas

- React
- Vite
- JavaScript (JSX)
- CSS
- Lucide React
- jsPDF
- jsPDF-AutoTable
- write-excel-file

## 3. Categorías disponibles

### 3.1. Inventario

Permite consultar:

- Inventario general.
- Productos con stock bajo.
- Productos agotados.

Incluye filtros por categoría y búsqueda de productos.

El reporte de control de vencimientos permanece deshabilitado
porque los datos actuales no incluyen fechas de vencimiento.

**Fuente de información:** `inventoryMock.js`.

**Estado:** datos demostrativos.

### 3.2. Citas

Permite consultar:

- Citas generales.
- Citas por período.
- Citas confirmadas.
- Citas completadas.
- Citas canceladas.
- Inasistencias.

Incluye filtros por estado, fechas y búsqueda.

**Fuente de información:** `useAppointments()`.

El contexto existente obtiene los datos desde Supabase.

El módulo de Reportes no realiza consultas adicionales ni
modifica registros de citas.

### 3.3. Pacientes

Permite consultar:

- Pacientes generales.
- Pacientes nuevos.
- Pacientes activos.
- Pacientes inactivos.
- Resumen administrativo de pacientes.

Incluye filtros por estado, fechas de registro y búsqueda.

**Fuente de información:** `usePatients()`.

El contexto existente obtiene los datos desde Supabase.

Los reportes utilizan información administrativa.
No incluyen expedientes, diagnósticos, tratamientos
ni antecedentes médicos.

### 3.4. Reporte general

Presenta un resumen de:

- Pacientes.
- Citas.
- Inventario.

Permite seleccionar un período para consultar las citas
y los registros de pacientes correspondientes.

Los totales históricos de pacientes y el estado actual
del inventario no se limitan por ese período.

Las estadísticas de inventario son demostrativas.

## 4. Exportación de documentos

El módulo permite descargar reportes en:

- PDF (.pdf).
- Excel (.xlsx).

Los documentos incluyen:

- Nombre de la clínica.
- Título del reporte.
- Fecha de generación.
- Período consultado.
- Resultados del reporte.
- Avisos sobre datos demostrativos cuando corresponda.

Los resultados exportados se construyen a partir de
la información filtrada en la interfaz.

### 4.1. Archivos principales

`src/utils/reports/reportExportData.js`

Transforma los resultados de las distintas categorías
en una estructura común para exportar.

`src/utils/reports/exportExcel.js`

Genera archivos Excel utilizando `write-excel-file`.

`src/utils/reports/exportPdf.js`

Genera documentos PDF utilizando `jsPDF` y `jsPDF-AutoTable`.

`src/components/reports/ReportExportActions.jsx`

Contiene los botones y mensajes de exportación.

### 4.2. Carga de bibliotecas

Las bibliotecas de exportación se cargan dinámicamente
cuando el usuario solicita un documento.

Esto evita cargar dichas funcionalidades al abrir
inicialmente el dashboard.

## 5. Organización de archivos

```text
src/
├── pages/
│   └── Reports.jsx
│
├── components/
│   └── reports/
│       ├── ReportsFilters.jsx
│       ├── ReportsPreview.jsx
│       ├── AppointmentReportsFilters.jsx
│       ├── AppointmentReportsPreview.jsx
│       ├── PatientReportsFilters.jsx
│       ├── PatientReportsPreview.jsx
│       ├── GeneralReportsFilters.jsx
│       ├── GeneralReportsPreview.jsx
│       └── ReportExportActions.jsx
│
├── utils/
│   └── reports/
│       ├── reportFilters.js
│       ├── appointmentReportFilters.js
│       ├── patientReportFilters.js
│       ├── generalReportUtils.js
│       ├── reportExportData.js
│       ├── exportExcel.js
│       └── exportPdf.js
│
└── styles/
    └── reports/
        ├── reports.css
        ├── reports-filters.css
        ├── reports-preview.css
        ├── appointment-reports-filters.css
        ├── appointment-reports-preview.css
        ├── patient-reports-preview.css
        ├── general-reports-preview.css
        └── report-export-actions.css
```

## 6. Integración con el sistema

La pantalla principal se encuentra en:

`src/pages/Reports.jsx`

El módulo está integrado en las rutas del dashboard.

Las citas y los pacientes se consultan mediante sus
hooks existentes:

- `useAppointments()`
- `usePatients()`

No fue necesario modificar las operaciones de Supabase.

### Consideraciones para el backend

El equipo deberá verificar:

- Autenticación de usuarios.
- Autorización para acceder a reportes.
- Políticas de acceso a los datos de pacientes y citas.
- Permisos de exportación de información administrativa.
- Sustitución de los datos demostrativos del inventario.
- Manejo consistente de errores de las consultas.

Los permisos del frontend no sustituyen los controles
de seguridad del backend y la base de datos.

## 7. Diseño responsive

Se implementaron vistas para escritorio y teléfonos.

Las categorías de Inventario, Citas y Pacientes utilizan
tablas en escritorio y presentaciones adaptadas a móvil.

El reporte general utiliza tarjetas de indicadores.

Los botones de exportación también están adaptados
para pantallas pequeñas.

## 8. Pruebas realizadas

Durante el desarrollo se verificó:

- Navegación entre categorías.
- Selección y limpieza de filtros.
- Búsqueda de registros.
- Vistas previas.
- Generación y apertura de archivos PDF.
- Generación y apertura de archivos Excel.
- Compilación con `npm run build`.
- Visualización en escritorio y teléfono.

Las pruebas funcionales fueron manuales.

No se implementó una suite automatizada de pruebas
para este módulo.

## 9. Funcionalidades pendientes

### Gráficas adicionales

Queda pendiente incorporar gráficas para visualizar
tendencias y distribuciones administrativas.

### Mejoras de estados de carga y error

Se pueden ampliar los mensajes de carga, errores
de conexión y opciones para reintentar consultas.

El contexto de citas actualmente no proporciona
un estado de error independiente.

### Optimización

Queda pendiente revisar el tamaño del bundle
de JavaScript y aplicar separación de código
cuando corresponda.

Durante el desarrollo, Vite mostró una advertencia
por archivos JavaScript superiores a 500 kB.

La advertencia no impidió generar la compilación.

### Mejoras futuras

- Integrar inventario con datos reales.
- Incorporar fechas de vencimiento cuando estén disponibles.
- Implementar permisos de exportación según roles.
- Agregar pruebas automatizadas.
- Ampliar las opciones de personalización de reportes.

## 10. Ejecución local

Desde la carpeta `frontend`:

Instalar dependencias:

```bash
npm install
```

Iniciar servidor de desarrollo:

```bash
npm run dev
```

Compilar para producción:

```bash
npm run build
```

## 11. Estado de entrega

El módulo cuenta con cuatro categorías funcionales,
filtros, vistas previas y exportaciones PDF/Excel.

Se entrega como implementación frontend, con las
limitaciones y mejoras pendientes descritas anteriormente.

La integración futura del inventario y los controles
de acceso deberán coordinarse con el equipo backend.