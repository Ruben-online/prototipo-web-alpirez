import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function PublicScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // No intervenir en las rutas del dashboard.
    if (
      pathname !== '/' &&
      pathname !== '/sobre-la-doctora'
    ) {
      return
    }

    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      })

      return
    }

    let animationFrameId

    const scrollToSection = () => {
      const sectionId = decodeURIComponent(hash.slice(1))
      const section = document.getElementById(sectionId)

      if (!section) {
        return
      }

      const navbar = document.querySelector('.navbar')
      const navbarHeight = navbar?.offsetHeight ?? 0

      const sectionTop =
        section.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight -
        12

      window.scrollTo({
        top: Math.max(0, sectionTop),
        behavior: 'instant'
      })
    }

    animationFrameId = window.requestAnimationFrame(
      scrollToSection
    )

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [pathname, hash])

  return null
}

export default PublicScrollManager