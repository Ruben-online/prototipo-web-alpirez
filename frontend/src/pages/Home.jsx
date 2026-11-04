import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Services from '../components/landing/Services'
import About from '../components/landing/About'
import Treatments from '../components/landing/Treatments'
import Contact from '../components/landing/Contact'
import Footer from '../components/landing/Footer'

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <About />
        <Treatments />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default Home