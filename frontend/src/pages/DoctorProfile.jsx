import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  GraduationCap,
  Award
} from 'lucide-react'

import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'

import doctorImage from '../assets/doctora-marcela.png'
import { doctorEducation } from '../data/doctorEducation'

import '../styles/landing/doctor-profile.css'

function DoctorProfile() {
  return (
    <>
      <Navbar />

      <main className="doctor-profile">

        {/* PRESENTACIÓN */}

        <section className="doctor-profile-hero">
          <div className="doctor-profile-container">

            <Link
              to="/#sobre-mi"
              className="doctor-profile-back"
            >
              <ArrowLeft size={18} aria-hidden="true" />
              Volver a Sobre mí
            </Link>

            <div className="doctor-profile-hero-grid">

              <div className="doctor-profile-hero-content">
                <span className="section-eyebrow">
                  CONOCE A LA DOCTORA
                </span>

                <h1>
                  Dra. Marcela
                  <br />
                  <span>Alpírez</span>
                </h1>

                <p className="doctor-profile-hero-subtitle">
                  Formación y trayectoria profesional
                </p>

                <p className="doctor-profile-hero-description">
                  Una trayectoria dedicada al conocimiento médico,
                  la actualización profesional y el cuidado
                  integral de la piel.
                </p>

                <a
                  href="/#contacto"
                  className="doctor-profile-primary-button"
                >
                  Agendar una cita

                  <ArrowUpRight
                    size={19}
                    aria-hidden="true"
                  />
                </a>
              </div>

              <div className="doctor-profile-hero-visual">
                <div className="doctor-profile-image-background" />

                <div className="doctor-profile-image-container">
                  <img
                    src={doctorImage}
                    alt="Dra. Marcela Alpírez"
                    className="doctor-profile-image"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FORMACIÓN ACADÉMICA */}

        <section className="doctor-profile-education">
          <div className="doctor-profile-container">

            <div className="doctor-profile-section-header">
              <span className="doctor-profile-section-icon">
                <GraduationCap
                  size={24}
                  aria-hidden="true"
                />
              </span>

              <span className="section-eyebrow">
                PREPARACIÓN PROFESIONAL
              </span>

              <h2>
                Formación <span>académica</span>
              </h2>

              <p>
                Estudios y formación que forman parte de
                su trayectoria profesional.
              </p>
            </div>

            <ol className="doctor-profile-timeline">
              {doctorEducation.education.map((item) => (
                <li
                  key={item.id}
                  className="doctor-profile-timeline-item"
                >
                  <div className="doctor-profile-timeline-year">
                    {item.year}
                  </div>

                  <div className="doctor-profile-timeline-marker">
                    <span />
                  </div>

                  <div className="doctor-profile-timeline-content">

                    <div className="doctor-profile-education-entry">

                      <div className="doctor-profile-institution-logo">
                        <img
                          src={item.logo}
                          alt={`Logotipo de ${item.institution}`}
                          loading="lazy"
                        />
                      </div>

                      <div className="doctor-profile-education-details">

                        <h3>{item.degree}</h3>

                        <p>{item.institution}</p>

                        <span className="doctor-profile-timeline-country">
                          <span
                            className="doctor-profile-country-flag"
                            role="img"
                            aria-label={`Bandera de ${item.country}`}
                          >
                            {item.flag}
                          </span>

                          {item.country}
                        </span>

                      </div>

                    </div>

                  </div>
                </li>
              ))}
            </ol>

          </div>
        </section>

        {/* TRAYECTORIA PROFESIONAL */}

        <section className="doctor-profile-career">
          <div className="doctor-profile-container">

            <div className="doctor-profile-section-header">
              <span className="doctor-profile-section-icon">
                <Award
                  size={24}
                  aria-hidden="true"
                />
              </span>

              <span className="section-eyebrow">
                EXPERIENCIA EN LA INDUSTRIA
              </span>

              <h2>
                Trayectoria <span>profesional</span>
              </h2>

              <p>
                Participación como líder de opinión
                y conferencista en el sector.
              </p>
            </div>

            <div className="doctor-profile-career-grid">
              {doctorEducation.professionalExperience.map(
                (item) => (
                  <article
                    key={item.id}
                    className="doctor-profile-career-card"
                  >

                    <div className="doctor-profile-career-logo">
                      <img
                        src={item.logo}
                        alt={`Logotipo de ${item.organization}`}
                        loading="lazy"
                      />
                    </div>

                    <div className="doctor-profile-career-details">

                      <span className="doctor-profile-career-label">
                        COLABORACIÓN PROFESIONAL
                      </span>

                      <h3>{item.organization}</h3>

                      <p>{item.role}</p>

                    </div>

                  </article>
                )
              )}
            </div>

          </div>
        </section>

        {/* CONTACTO */}

        <section className="doctor-profile-cta">
          <div className="doctor-profile-container">
            <div className="doctor-profile-cta-content">

              <span className="section-eyebrow">
                ATENCIÓN PERSONALIZADA
              </span>

              <h2>
                Tu piel merece
                <br />
                <span>atención profesional.</span>
              </h2>

              <p>
                Conoce nuestros servicios y encuentra
                el tratamiento adecuado para tus necesidades.
              </p>

              <a
                href="/#contacto"
                className="doctor-profile-primary-button"
              >
                Contactar a la clínica

                <ArrowUpRight
                  size={19}
                  aria-hidden="true"
                />
              </a>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}

export default DoctorProfile