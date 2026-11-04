import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Si el usuario no tiene permiso para este módulo, lo regresa al resumen
function ModuleRoute({ module }) {
  const { hasModule } = useAuth()

  if (!hasModule(module)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default ModuleRoute
