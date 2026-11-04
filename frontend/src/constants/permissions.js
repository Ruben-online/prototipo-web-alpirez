// Módulos que el admin puede dar o quitar a cada usuario (el resumen lo ven todos)
export const MODULES = [
  { key: 'pacientes', label: 'Pacientes' },
  { key: 'citas', label: 'Citas' },
  { key: 'inventario', label: 'Inventario' },
  { key: 'reportes', label: 'Reportes' },
  { key: 'usuarios', label: 'Usuarios' },
]

// Módulos que se marcan solos al escoger cada rol, el admin los puede cambiar
export const ROLE_TEMPLATES = {
  Admin: ['pacientes', 'citas', 'inventario', 'reportes', 'usuarios'],
  Doctora: ['pacientes', 'citas', 'inventario', 'reportes'],
  Secretaria: ['pacientes', 'citas'],
}

export const ROLES = Object.keys(ROLE_TEMPLATES)
