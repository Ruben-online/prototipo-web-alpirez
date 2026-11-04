import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Services from '../components/landing/Services'
import About from '../components/landing/About'
import Treatments from '../components/landing/Treatments'
import Testimonials from '../components/landing/Testimonials'
import Contact from '../components/landing/Contact'
import Footer from '../components/landing/Footer'
import { useLandingData } from '../hooks/useLandingData'

function Home() {
  const { services, treatments, testimonials, info } = useLandingData()

  return (
    <>
      <Navbar info={info} />

      <main>
        <Hero info={info} />
        <Services servicesData={services} />
        <About info={info} />
        <Treatments treatmentsData={treatments} />
        <Testimonials testimonialsData={testimonials} />
        <Contact info={info} />
      </main>

      <Footer info={info} />
    </>
  )
}

export default Home
