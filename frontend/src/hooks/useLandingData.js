import { useState, useEffect } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

/**
 * Hook reutilizable para obtener los datos de la landing page desde el backend.
 * Implementa el patrón Stale-While-Revalidate: si la petición falla o la red
 * no está disponible, conserva datos por defecto (fallback) para que la página
 * nunca quede en blanco ni se rompa.
 */
export function useLandingData() {
  const [data, setData] = useState({
    services: [],
    treatments: [],
    testimonials: [],
    info: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    let isMounted = true

    async function fetchLanding() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/landing/all`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        if (isMounted && result.success && result.data) {
          setData({
            services: result.data.services || [],
            treatments: result.data.treatments || [],
            testimonials: result.data.testimonials || [],
            info: result.data.info || null,
            loading: false,
            error: null
          })
        }
      } catch (err) {
        console.warn('Backend no disponible o error al obtener datos de landing page. Usando fallback local:', err.message)
        if (isMounted) {
          setData((prev) => ({
            ...prev,
            loading: false,
            error: err.message
          }))
        }
      }
    }

    fetchLanding()

    return () => {
      isMounted = false
    }
  }, [])

  return data
}

