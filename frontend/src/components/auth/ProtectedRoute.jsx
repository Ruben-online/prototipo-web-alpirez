import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Si no hay sesión abierta, manda al login
function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
