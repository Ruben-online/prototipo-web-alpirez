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
import Reports from './pages/Reports'

import DashboardLayout from './layouts/DashboardLayout'

import { PatientsProvider } from './context/PatientsContext.jsx'
import { AppointmentsProvider } from './context/AppointmentsContext.jsx'
import { InventoryProvider } from './context/InventoryContext.jsx'


function App() {
  return (
    <BrowserRouter>

      <PatientsProvider>

        <AppointmentsProvider>

          <InventoryProvider>

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

              <Route
                path="reportes"
                element={<Reports />}
              />

            </Route>

          </Routes>

          </InventoryProvider>

        </AppointmentsProvider>

      </PatientsProvider>


    </BrowserRouter>
  )
}

export default App