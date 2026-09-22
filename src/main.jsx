import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/global.css'
import './styles/navbar.css'
import './styles/hero.css'
import './styles/services.css'
import './styles/about.css'
import './styles/treatments.css'
import './styles/testimonials.css'
import './styles/contact.css'
import './styles/footer.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)