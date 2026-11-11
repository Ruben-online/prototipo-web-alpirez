import {
  ArrowUpRight,
  Clock3,
  MapPin,
  Navigation,
} from 'lucide-react'

import { locationHoursData } from '../../data/locationHours'

function LocationHours() {
  const { clinic, schedule } = locationHoursData

  const { latitude, longitude } = clinic.coordinates

  const hasCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180

  const googleMapsEmbedUrl = hasCoordinates
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`
    : null

  const wazeUrl = hasCoordinates
    ? `https://www.waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes`
    : null

  return (
    <section
      id="ubicacion-horarios"
      className="location-hours"
      aria-labelledby="location-hours-title"
    >
      <div className="location-hours-container">

        {/* =========================
            CONTENIDO
        ========================= */}

        <div className="location-hours-content">

          <span className="section-eyebrow">
            UBICACIÓN Y HORARIOS
          </span>

          <h2 id="location-hours-title">
            Tu próxima visita
            <span> comienza aquí.</span>
          </h2>

          <p className="location-hours-description">
            Queremos que tu experiencia sea cómoda
            desde el primer momento. Encuentra nuestra
            clínica y planifica tu visita con toda
            la información que necesitas.
          </p>

          {/* =========================
              INFORMACIÓN
          ========================= */}

          <div className="location-hours-highlights">

            {/* UBICACIÓN */}

            <div className="location-hours-highlight">

              <div className="location-hours-highlight-content">

                <div className="location-hours-highlight-heading">

                  <MapPin size={21} />

                  <strong>
                    Nuestra ubicación
                  </strong>

                </div>

                <p className="location-hours-building">
                  {clinic.building}
                </p>

                <p>
                  {clinic.city}
                </p>

                {clinic.address && (
                  <p>{clinic.address}</p>
                )}

                <span className="location-hours-office">
                  {clinic.floor} · {clinic.office}
                </span>

              </div>

            </div>

            {/* HORARIOS */}

            <div className="location-hours-highlight">

              <div className="location-hours-highlight-content">

                <div className="location-hours-highlight-heading">

                  <Clock3 size={21} />

                  <strong>
                    Horarios de atención
                  </strong>

                </div>

                {schedule.confirmed ? (
                  <div className="location-hours-schedule">

                    {schedule.locations.map((location) => (
                      <div
                        className="location-hours-schedule-location"
                        key={location.id}
                      >

                        <h3 className="location-hours-schedule-city">
                          {location.city}
                        </h3>

                        {location.days.map(({ day, hours }) => (
                          <div
                            className="location-hours-schedule-row"
                            key={`${location.id}-${day}`}
                          >

                            <span>
                              {day}
                            </span>

                            <strong>
                              {hours}
                            </strong>

                          </div>
                        ))}

                      </div>
                    ))}

                    {schedule.appointmentOnly === true && (
                      <p className="location-hours-appointment-note">
                        Atención únicamente con cita previa.
                      </p>
                    )}

                  </div>
                ) : (
                  <p className="location-hours-pending">
                    {schedule.pendingMessage}
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* =========================
              BOTONES DE NAVEGACIÓN
          ========================= */}

          <div className="location-hours-actions">

            <a
              href={clinic.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="location-hours-button location-hours-button-primary"
            >
              <MapPin size={19} />

              <span>Google Maps</span>

              <ArrowUpRight size={17} />
            </a>

            {wazeUrl && (
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="location-hours-button location-hours-button-secondary"
              >
                <Navigation size={19} />

                <span>Waze</span>

                <ArrowUpRight size={17} />
              </a>
            )}

          </div>

        </div>

        {/* =========================
            MAPA
        ========================= */}

        <div className="location-hours-visual">

          <div className="location-hours-map-background" />

          <div className="location-hours-map-container">

            {googleMapsEmbedUrl ? (
              <iframe
                title={`Ubicación de ${clinic.name} en ${clinic.city}`}
                src={googleMapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="location-hours-map-fallback">

                <MapPin size={32} />

                <p>
                  Consulta nuestra ubicación
                  en Google Maps.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  )
}

export default LocationHours