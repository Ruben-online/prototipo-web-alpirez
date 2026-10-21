import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/global.css'

// Estilos de la landing page
import './styles/landing/navbar.css'
import './styles/landing/hero.css'
import './styles/landing/services.css'
import './styles/landing/about.css'
import './styles/landing/treatments.css'
import './styles/landing/testimonials.css'
import './styles/landing/contact.css'
import './styles/landing/footer.css'

// Estilos de autenticación y dashboard
import './styles/auth/login.css'
import './styles/dashboard/dashboard.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)