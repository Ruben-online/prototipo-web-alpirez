import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
import Appointments from './pages/Appointments'

import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

import { AuthProvider } from './context/AuthContext.jsx'
import { PatientsProvider } from './context/PatientsContext.jsx'
import { AppointmentsProvider } from './context/AppointmentsContext.jsx'


function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <PatientsProvider>

          <AppointmentsProvider>

            <Routes>

              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/recuperar-contrasena"
                element={<ForgotPassword />}
              />

              <Route
                path="/restablecer-contrasena"
                element={<ResetPassword />}
              />

              {/* Solo se puede entrar al panel con sesión abierta */}
              <Route element={<ProtectedRoute />}>

                <Route
                  path="/dashboard"
                  element={<DashboardLayout />}
                >

                  <Route
                    index
                    element={<Dashboard />}
                  />

                  <Route
                    path="pacientes"
                    element={<Patients />}
                  />

                  <Route
                    path="pacientes/:id"
                    element={<PatientDetail />}
                  />

                  <Route
                    path="citas"
                    element={<Appointments />}
                  />

                </Route>

              </Route>

            </Routes>

          </AppointmentsProvider>

        </PatientsProvider>

      </AuthProvider>

    </BrowserRouter>
  )
}

export default App
