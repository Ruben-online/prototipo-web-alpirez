import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
import DashboardLayout from './layouts/DashboardLayout'

import { PatientsProvider } from './context/PatientsContext'

function App() {
  return (
    <BrowserRouter>
      <PatientsProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="pacientes" element={<Patients />} />

            <Route path="pacientes/:id" element={<PatientDetail />} />
          </Route>
        </Routes>
      </PatientsProvider>
    </BrowserRouter>
  )
}

export default App