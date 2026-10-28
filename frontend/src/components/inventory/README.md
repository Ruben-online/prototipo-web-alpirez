# Módulo de Inventario

## Estado

Frontend funcional con datos de demostración.

La integración con Supabase y la persistencia de información
quedan pendientes para el equipo encargado del backend.

## Funcionalidades implementadas

- Visualización del catálogo de productos.
- Estadísticas generales.
- Búsqueda por nombre, código, categoría y marca.
- Filtros por disponibilidad y categoría.
- Paginación.
- Modal de detalles.
- Formulario de registro.
- Formulario de edición.
- Validaciones básicas.
- Diseño responsive para escritorio y teléfono.

## Archivos principales

- `pages/Inventory.jsx`: página principal y estado del inventario.
- `components/inventory/InventoryTable.jsx`: tabla de productos.
- `components/inventory/InventoryDetailsModal.jsx`: modal de detalles.
- `components/inventory/InventoryFormModal.jsx`: formulario de registro y edición.
- `data/inventoryMock.js`: productos ficticios y función de estado.
- `styles/inventory/`: estilos del módulo.

Las rutas anteriores son relativas a `frontend/src/`.

## Datos de demostración

Actualmente los productos se obtienen desde `inventoryMock.js`.

Las operaciones de registro y edición se simulan mediante
el estado local de React.

Los cambios no se almacenan en Supabase ni en localStorage.

Al recargar la página se restauran los productos originales.

## Integración pendiente

El equipo de backend deberá:

1. Sustituir los datos ficticios por productos reales.
2. Implementar la consulta del inventario.
3. Conectar el registro de productos.
4. Conectar la edición de productos.
5. Implementar la gestión real de existencias.
6. Proporcionar información de vencimientos si se requiere.
7. Implementar las validaciones definitivas en el backend.
8. Gestionar los estados de carga y error de las operaciones.

## Estructura de datos utilizada actualmente

```js
{
  id: 1,
  code: 'PROD-001',
  name: 'Protector solar facial SPF 50',
  category: 'Dermatológicos',
  brand: 'La Roche-Posay',
  stock: 25,
  minStock: 5,
  unit: 'Unidad',
  price: 185
}
```

## Consideraciones

- El frontend utiliza `getInventoryStatus()` para determinar
  si un producto está disponible, tiene stock bajo o está agotado.
- El formulario no permite modificar directamente las existencias.
- Los productos nuevos reciben temporalmente un stock de cero.
- El indicador de próximos a vencer permanece sin datos reales.
- No se deben interpretar las operaciones simuladas como
  registros persistidos en la base de datos.

## Verificaciones

- Compilación de producción: correcta.
- Responsive de escritorio y teléfono: verificado.
- Funcionalidades principales: verificadas manualmente.
- ESLint: revisión general pospuesta; existen errores
  pendientes en Inventario y otros módulos.