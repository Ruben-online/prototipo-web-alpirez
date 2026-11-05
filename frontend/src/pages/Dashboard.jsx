import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Boxes,
  CalendarDays,
  UserRound,
  UsersRound,
} from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import { usePatients } from '../hooks/usePatients'
import { useAppointments } from '../hooks/useAppointments'
import { useInventory } from '../hooks/useInventory'

import { supabase } from '../supabase'

// ==========================================
// FECHAS
// ==========================================

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function getLocalDate(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getFormattedDate(date) {
  return new Intl.DateTimeFormat('es-GT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function getStartOfWeek(date) {
  const result = new Date(date)
  const day = result.getDay()
  const difference = day === 0 ? 6 : day - 1

  result.setDate(result.getDate() - difference)
  result.setHours(0, 0, 0, 0)

  return result
}

function formatTime(time) {
  const [hours, minutes] = time.split(':').map(Number)

  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedHour = hours % 12 || 12

  return {
    hour: `${String(formattedHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    period,
  }
}

// ==========================================
// ESTADOS DE CITAS
// ==========================================

function getAppointmentStatus(status) {
  switch (status) {
    case 'Confirmada':
      return 'confirmed'

    case 'Completada':
      return 'confirmed'

    case 'Cancelada':
    case 'No asistió':
      return 'pending'

    default:
      return 'pending'
  }
}

// ==========================================
// DASHBOARD
// ==========================================

function Dashboard() {
  const navigate = useNavigate()

  const { profile, user } = useAuth()

  const {
    patients,
    loading: patientsLoading,
    error: patientsError,
  } = usePatients()

  const {
    appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments()

  const {
    items,
    loading: inventoryLoading,
    error: inventoryError,
  } = useInventory()

  const [now, setNow] = useState(() => new Date())

  const [monthlyConsultations, setMonthlyConsultations] = useState(0)
  const [consultationsLoading, setConsultationsLoading] = useState(true)
  const [consultationsError, setConsultationsError] = useState(null)

  const name = profile?.fullName || user?.email || 'Usuario'

  // ========================================
  // ACTUALIZAR FECHA
  // ========================================

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60_000)

    return () => clearInterval(interval)
  }, [])

  const today = getLocalDate(now)

  const formattedDate = getFormattedDate(now)

  // ========================================
  // CONSULTAS DEL MES
  // ========================================

  useEffect(() => {
    let active = true

    async function fetchMonthlyConsultations() {
      try {
        setConsultationsLoading(true)
        setConsultationsError(null)

        const year = now.getFullYear()
        const month = now.getMonth()

        const start = getLocalDate(new Date(year, month, 1))
        const end = getLocalDate(new Date(year, month + 1, 1))

        const { count, error } = await supabase
          .from('consultations')
          .select('*', { count: 'exact', head: true })
          .gte('consultation_date', start)
          .lt('consultation_date', end)

        if (error) throw error

        if (active) {
          setMonthlyConsultations(count ?? 0)
        }
      } catch (err) {
        console.error('Error fetching monthly consultations:', err)

        if (active) {
          setConsultationsError(err.message)
        }
      } finally {
        if (active) {
          setConsultationsLoading(false)
        }
      }
    }

    fetchMonthlyConsultations()

    return () => {
      active = false
    }
  }, [now.getFullYear(), now.getMonth()])

  // ========================================
  // ESTADÍSTICAS DE PACIENTES
  // ========================================

  const patientStats = useMemo(() => {
    const startOfWeek = getStartOfWeek(now)

    const newPatientsThisWeek = patients.filter((patient) => {
      if (!patient.createdAt) return false

      return new Date(patient.createdAt) >= startOfWeek
    }).length

    return {
      total: patients.length,
      newThisWeek: newPatientsThisWeek,
    }
  }, [patients, now])

  // ========================================
  // ESTADÍSTICAS DE CITAS
  // ========================================

  const appointmentStats = useMemo(() => {
    const todayAppointments = appointments
      .filter((appointment) => appointment.date === today)
      .sort((a, b) => a.time.localeCompare(b.time))

    const activeToday = todayAppointments.filter(
      (appointment) =>
        appointment.status !== 'Cancelada' &&
        appointment.status !== 'No asistió'
    )

    const confirmedToday = todayAppointments.filter(
      (appointment) => appointment.status === 'Confirmada'
    )

    return {
      today: todayAppointments,
      activeToday: activeToday.length,
      confirmedToday: confirmedToday.length,
    }
  }, [appointments, today])

  // ========================================
  // ESTADÍSTICAS DE INVENTARIO
  // ========================================

  const inventoryStats = useMemo(() => {
    const lowStock = items.filter((item) => {
      const stock = Number(item.stock)
      const minimum = Number(item.minStock)

      return stock <= minimum
    })

    return {
      total: items.length,
      lowStock: lowStock.length,
    }
  }, [items])

  // ========================================
  // ESTADOS DE CARGA
  // ========================================

  const loading =
    patientsLoading ||
    appointmentsLoading ||
    inventoryLoading ||
    consultationsLoading

  const hasError =
    patientsError ||
    appointmentsError ||
    inventoryError ||
    consultationsError

  const displayValue = (value, isLoading, error) => {
    if (isLoading) return '...'
    if (error) return '—'

    return value
  }

  return (
    <>
      {/* ====================================
          BIENVENIDA
      ==================================== */}

      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-section-eyebrow">
            {formattedDate.toUpperCase()}
          </span>

          <h2>
            {getGreeting()}, {name}.
          </h2>

          <p>
            Aquí tienes un resumen de la actividad de la clínica.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-primary-button"
          onClick={() => navigate('/dashboard/citas')}
        >
          <CalendarDays size={18} strokeWidth={1.8} />
          <span>Nueva cita</span>
        </button>
      </section>

      {/* ====================================
          MENSAJES DE ESTADO
      ==================================== */}

      {loading && (
        <p role="status" className="dashboard-data-message">
          Cargando información de la clínica...
        </p>
      )}

      {hasError && (
        <p role="alert" className="dashboard-data-message dashboard-data-error">
          No se pudo cargar toda la información.
          Revisa la conexión e intenta nuevamente.
        </p>
      )}

      {/* ====================================
          ESTADÍSTICAS
      ==================================== */}

      <section className="dashboard-stats">

        {/* PACIENTES */}

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <div className="dashboard-stat-icon">
              <UsersRound size={21} strokeWidth={1.8} />
            </div>

            <span className="dashboard-stat-badge">
              Total
            </span>
          </div>

          <div className="dashboard-stat-content">
            <span>Pacientes registrados</span>

            <strong>
              {displayValue(
                patientStats.total,
                patientsLoading,
                patientsError
              )}
            </strong>

            <small>
              {displayValue(
                patientStats.newThisWeek,
                patientsLoading,
                patientsError
              )}{' '}
              nuevos esta semana
            </small>
          </div>
        </article>

        {/* CITAS */}

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <div className="dashboard-stat-icon">
              <CalendarDays size={21} strokeWidth={1.8} />
            </div>

            <span className="dashboard-stat-badge">
              Hoy
            </span>
          </div>

          <div className="dashboard-stat-content">
            <span>Citas programadas</span>

            <strong>
              {displayValue(
                appointmentStats.activeToday,
                appointmentsLoading,
                appointmentsError
              )}
            </strong>

            <small>
              {displayValue(
                appointmentStats.confirmedToday,
                appointmentsLoading,
                appointmentsError
              )}{' '}
              confirmadas para hoy
            </small>
          </div>
        </article>

        {/* CONSULTAS */}

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <div className="dashboard-stat-icon">
              <UserRound size={21} strokeWidth={1.8} />
            </div>

            <span className="dashboard-stat-badge">
              Este mes
            </span>
          </div>

          <div className="dashboard-stat-content">
            <span>Consultas del mes</span>

            <strong>
              {displayValue(
                monthlyConsultations,
                consultationsLoading,
                consultationsError
              )}
            </strong>

            <small>
              Consultas registradas en el mes actual
            </small>
          </div>
        </article>

        {/* INVENTARIO */}

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <div className="dashboard-stat-icon">
              <Boxes size={21} strokeWidth={1.8} />
            </div>

            <span className="dashboard-stat-warning">
              {displayValue(
                inventoryStats.lowStock,
                inventoryLoading,
                inventoryError
              )}{' '}
              alertas
            </span>
          </div>

          <div className="dashboard-stat-content">
            <span>Productos en inventario</span>

            <strong>
              {displayValue(
                inventoryStats.total,
                inventoryLoading,
                inventoryError
              )}
            </strong>

            <small>
              Productos con stock bajo o en el mínimo
            </small>
          </div>
        </article>
      </section>

      {/* ====================================
          PANELES INFERIORES
      ==================================== */}

      <section className="dashboard-overview-grid">

        {/* AGENDA */}

        <article className="dashboard-panel dashboard-schedule">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-eyebrow">
                AGENDA
              </span>

              <h3>Citas de hoy</h3>
            </div>

            <button
              type="button"
              onClick={() => navigate('/dashboard/citas')}
            >
              Ver todas
            </button>
          </div>

          <div className="dashboard-appointments">

            {appointmentsLoading ? (
              <p className="dashboard-empty-message">
                Cargando citas...
              </p>
            ) : appointmentsError ? (
              <p className="dashboard-empty-message">
                No se pudieron cargar las citas.
              </p>
            ) : appointmentStats.today.length === 0 ? (
              <p className="dashboard-empty-message">
                No hay citas programadas para hoy.
              </p>
            ) : (
              appointmentStats.today.map((appointment) => {
                const time = formatTime(appointment.time)

                return (
                  <div
                    key={appointment.id}
                    className="dashboard-appointment"
                  >
                    <div className="dashboard-appointment-time">
                      <strong>{time.hour}</strong>
                      <span>{time.period}</span>
                    </div>

                    <div className="dashboard-appointment-line" />

                    <div className="dashboard-appointment-info">
                      <strong>
                        {appointment.patient?.name ||
                          'Paciente sin nombre'}
                      </strong>

                      <span>
                        {appointment.service || 'Consulta'}
                      </span>
                    </div>

                    <span
                      className={`dashboard-status ${getAppointmentStatus(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                )
              })
            )}

          </div>
        </article>

        {/* VISTA RÁPIDA */}

        <article className="dashboard-panel dashboard-quick-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-eyebrow">
                ACTIVIDAD
              </span>

              <h3>Vista rápida</h3>
            </div>
          </div>

          <div className="dashboard-quick-list">

            <div className="dashboard-quick-item">
              <div className="dashboard-quick-icon">
                <UsersRound size={19} strokeWidth={1.8} />
              </div>

              <div>
                <strong>
                  {displayValue(
                    patientStats.newThisWeek,
                    patientsLoading,
                    patientsError
                  )}{' '}
                  pacientes nuevos
                </strong>

                <span>Registrados esta semana</span>
              </div>
            </div>

            <div className="dashboard-quick-item">
              <div className="dashboard-quick-icon">
                <CalendarDays size={19} strokeWidth={1.8} />
              </div>

              <div>
                <strong>
                  {displayValue(
                    appointmentStats.confirmedToday,
                    appointmentsLoading,
                    appointmentsError
                  )}{' '}
                  citas confirmadas
                </strong>

                <span>Programadas para hoy</span>
              </div>
            </div>

            <div className="dashboard-quick-item">
              <div className="dashboard-quick-icon">
                <Boxes size={19} strokeWidth={1.8} />
              </div>

              <div>
                <strong>
                  {displayValue(
                    inventoryStats.lowStock,
                    inventoryLoading,
                    inventoryError
                  )}{' '}
                  productos con stock bajo
                </strong>

                <span>Revisar inventario</span>
              </div>
            </div>

          </div>

          <div className="dashboard-quick-decoration">
            <span>✦</span>

            <div>
              <strong>Actividad de la clínica</strong>

              <p>
                Consulta aquí los indicadores actualizados
                de pacientes, citas e inventario.
              </p>
            </div>
          </div>
        </article>
      </section>
    </>
  )
}

export default Dashboard