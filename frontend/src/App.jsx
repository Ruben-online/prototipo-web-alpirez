import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
import Appointments from './pages/Appointments'
import Inventory from './pages/Inventory'

import DashboardLayout from './layouts/DashboardLayout'

import { PatientsProvider } from './context/PatientsContext.jsx'
import { AppointmentsProvider } from './context/AppointmentsContext.jsx'


function App() {
  return (
    <BrowserRouter>

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

              <Route
                path="inventario"
                element={<Inventory />}
              />

            </Route>

          </Routes>

        </AppointmentsProvider>

      </PatientsProvider>

    </BrowserRouter>
  )
}

export default App