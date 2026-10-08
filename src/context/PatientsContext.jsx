import { createContext, useContext, useState } from 'react'

const PatientsContext = createContext(null)

// ==========================================
// ANTECEDENTES MÉDICOS
// ==========================================

const emptyMedicalHistory = {
  allergies: '',
  conditions: '',
  medications: '',
  dermatologicalHistory: '',
  observations: '',
}

// ==========================================
// PACIENTES FICTICIOS
// ==========================================

const initialPatients = [
  {
    id: 1,
    name: 'María González',
    initials: 'MG',
    email: 'maria.gonzalez@email.com',
    phone: '5555-1234',
    birthDate: '1995-03-15',
    sex: 'Femenino',
    address: 'Ciudad de Guatemala',
    lastVisit: '04 oct 2026',
    status: 'Activo',
    consultations: 8,
    medicalHistory: {
      allergies: 'Ninguna conocida',
      conditions: 'No refiere enfermedades crónicas',
      medications: 'Ninguno actualmente',
      dermatologicalHistory:
        'Antecedentes de acné facial y piel sensible.',
      observations:
        'Paciente en seguimiento dermatológico periódico.',
    },
  },
  {
    id: 2,
    name: 'Andrea Martínez',
    initials: 'AM',
    email: 'andrea.martinez@email.com',
    phone: '5555-2345',
    birthDate: '1998-07-21',
    sex: 'Femenino',
    address: 'Mixco, Guatemala',
    lastVisit: '02 oct 2026',
    status: 'Activo',
    consultations: 5,
    medicalHistory: {
      allergies: 'No registradas',
      conditions: 'No registradas',
      medications: 'No registrados',
      dermatologicalHistory:
        'Antecedentes de dermatitis de contacto.',
      observations: '',
    },
  },
  {
    id: 3,
    name: 'Carolina Ramírez',
    initials: 'CR',
    email: 'carolina.ramirez@email.com',
    phone: '5555-3456',
    birthDate: '1989-11-08',
    sex: 'Femenino',
    address: 'Ciudad de Guatemala',
    lastVisit: '28 sep 2026',
    status: 'Activo',
    consultations: 12,
    medicalHistory: {
      allergies: '',
      conditions: '',
      medications: '',
      dermatologicalHistory:
        'Seguimiento por manchas e hiperpigmentación facial.',
      observations: '',
    },
  },
  {
    id: 4,
    name: 'Laura Castillo',
    initials: 'LC',
    email: 'laura.castillo@email.com',
    phone: '5555-4567',
    birthDate: '1992-05-12',
    sex: 'Femenino',
    address: 'Villa Nueva, Guatemala',
    lastVisit: '25 sep 2026',
    status: 'Inactivo',
    consultations: 2,
    medicalHistory: { ...emptyMedicalHistory },
  },
  {
    id: 5,
    name: 'Sofía Herrera',
    initials: 'SH',
    email: 'sofia.herrera@email.com',
    phone: '5555-5678',
    birthDate: '2000-01-30',
    sex: 'Femenino',
    address: 'Ciudad de Guatemala',
    lastVisit: '20 sep 2026',
    status: 'Activo',
    consultations: 6,
    medicalHistory: { ...emptyMedicalHistory },
  },
  {
    id: 6,
    name: 'Valeria López',
    initials: 'VL',
    email: 'valeria.lopez@email.com',
    phone: '5555-6789',
    birthDate: '1997-09-04',
    sex: 'Femenino',
    address: 'Antigua Guatemala',
    lastVisit: '18 sep 2026',
    status: 'Activo',
    consultations: 4,
    medicalHistory: { ...emptyMedicalHistory },
  },
  {
    id: 7,
    name: 'Gabriela Morales',
    initials: 'GM',
    email: 'gabriela.morales@email.com',
    phone: '5555-7890',
    birthDate: '1986-12-18',
    sex: 'Femenino',
    address: 'Ciudad de Guatemala',
    lastVisit: '12 sep 2026',
    status: 'Inactivo',
    consultations: 3,
    medicalHistory: { ...emptyMedicalHistory },
  },
  {
    id: 8,
    name: 'Daniela Pérez',
    initials: 'DP',
    email: 'daniela.perez@email.com',
    phone: '5555-8901',
    birthDate: '1994-06-25',
    sex: 'Femenino',
    address: 'Mixco, Guatemala',
    lastVisit: '08 sep 2026',
    status: 'Activo',
    consultations: 7,
    medicalHistory: { ...emptyMedicalHistory },
  },
]

// ==========================================
// CONSULTAS FICTICIAS
// ==========================================

const initialConsultations = [
  {
    id: 1,
    patientId: 1,
    date: '2026-10-04',
    reason: 'Seguimiento por acné facial',
    diagnosis: 'Acné vulgar leve',
    treatment:
      'Tratamiento dermatológico tópico y rutina de limpieza facial.',
    observations:
      'Se observa mejoría respecto a la consulta anterior.',
    followUpDate: '2026-11-04',
  },
  {
    id: 2,
    patientId: 1,
    date: '2026-09-10',
    reason: 'Evaluación dermatológica',
    diagnosis: 'Acné vulgar moderado',
    treatment:
      'Se indica tratamiento tópico y recomendaciones de cuidado facial.',
    observations:
      'Paciente refiere brotes frecuentes en la zona facial.',
    followUpDate: '2026-10-04',
  },
  {
    id: 3,
    patientId: 1,
    date: '2026-08-12',
    reason: 'Primera evaluación por acné',
    diagnosis: 'Acné inflamatorio',
    treatment:
      'Se establece plan inicial de tratamiento dermatológico.',
    observations:
      'Se recomienda seguimiento periódico.',
    followUpDate: '2026-09-10',
  },
  {
    id: 4,
    patientId: 2,
    date: '2026-10-02',
    reason: 'Control de dermatitis',
    diagnosis: 'Dermatitis de contacto',
    treatment:
      'Se recomienda evitar agentes irritantes y continuar el cuidado de la piel.',
    observations:
      'Disminución del enrojecimiento y la irritación.',
    followUpDate: '2026-11-02',
  },
  {
    id: 5,
    patientId: 2,
    date: '2026-09-05',
    reason: 'Evaluación de irritación cutánea',
    diagnosis: 'Dermatitis de contacto',
    treatment:
      'Se indican medidas de protección de la barrera cutánea.',
    observations:
      'Se identifican posibles factores desencadenantes.',
    followUpDate: '2026-10-02',
  },
  {
    id: 6,
    patientId: 3,
    date: '2026-09-28',
    reason: 'Seguimiento de manchas faciales',
    diagnosis: 'Hiperpigmentación facial',
    treatment:
      'Continuar tratamiento dermatológico y fotoprotección.',
    observations:
      'Evolución favorable de las manchas.',
    followUpDate: '2026-10-28',
  },
  {
    id: 7,
    patientId: 4,
    date: '2026-09-25',
    reason: 'Evaluación de piel sensible',
    diagnosis: 'Irritación cutánea leve',
    treatment:
      'Recomendaciones de hidratación y cuidado de la piel.',
    observations:
      'Se recomienda seguimiento según evolución.',
    followUpDate: '',
  },
  {
    id: 8,
    patientId: 5,
    date: '2026-09-20',
    reason: 'Consulta dermatológica general',
    diagnosis: 'Piel mixta',
    treatment:
      'Rutina de cuidado facial adaptada al tipo de piel.',
    observations:
      'Sin hallazgos dermatológicos relevantes.',
    followUpDate: '',
  },
  {
    id: 9,
    patientId: 6,
    date: '2026-09-18',
    reason: 'Evaluación de resequedad cutánea',
    diagnosis: 'Xerosis cutánea',
    treatment:
      'Recomendaciones de hidratación y protección cutánea.',
    observations:
      'Se sugiere seguimiento si persisten los síntomas.',
    followUpDate: '',
  },
  {
    id: 10,
    patientId: 7,
    date: '2026-09-12',
    reason: 'Consulta por irritación facial',
    diagnosis: 'Dermatitis leve',
    treatment:
      'Medidas generales de cuidado dermatológico.',
    observations:
      'Se recomienda evitar productos irritantes.',
    followUpDate: '',
  },
  {
    id: 11,
    patientId: 8,
    date: '2026-09-08',
    reason: 'Evaluación dermatológica preventiva',
    diagnosis: 'Sin alteraciones relevantes',
    treatment:
      'Recomendaciones de fotoprotección y cuidado preventivo.',
    observations:
      'Paciente sin molestias actuales.',
    followUpDate: '',
  },
]

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

// Convierte una fecha YYYY-MM-DD a un formato legible.

function formatConsultationDate(dateString) {
  if (!dateString) return 'Sin consultas'

  const [year, month, day] = dateString.split('-').map(Number)

  return new Date(year, month - 1, day).toLocaleDateString('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Obtiene las consultas de un paciente y las ordena
// desde la más reciente hasta la más antigua.

function getSortedPatientConsultations(consultations, patientId) {
  return consultations
    .filter(
      (consultation) =>
        consultation.patientId === Number(patientId)
    )
    .sort((a, b) => {
      const dateComparison = b.date.localeCompare(a.date)

      return dateComparison !== 0
        ? dateComparison
        : b.id - a.id
    })
}

// Calcula el número de consultas y la última visita.

function getConsultationSummary(consultations, patientId) {
  const patientConsultations = getSortedPatientConsultations(
    consultations,
    patientId
  )

  const latestConsultation = patientConsultations[0]

  return {
    consultations: patientConsultations.length,
    lastVisit: latestConsultation
      ? formatConsultationDate(latestConsultation.date)
      : 'Sin consultas',
  }
}

// ==========================================
// PROVIDER
// ==========================================

export function PatientsProvider({ children }) {

  // ==========================================
  // ESTADO DE PACIENTES
  // ==========================================

  const [patients, setPatients] = useState(() =>
    initialPatients.map((patient) => ({
      ...patient,
      ...getConsultationSummary(
        initialConsultations,
        patient.id
      ),
    }))
  )

  // ==========================================
  // ESTADO DE CONSULTAS
  // ==========================================

  const [consultations, setConsultations] = useState(
    initialConsultations
  )

  // ==========================================
  // OBTENER PACIENTE POR ID
  // ==========================================

  const getPatientById = (id) => {
    return patients.find(
      (patient) => patient.id === Number(id)
    )
  }

  // ==========================================
  // REGISTRAR PACIENTE
  // ==========================================

  const addPatient = (newPatient) => {
    setPatients((previous) => [
      {
        ...newPatient,
        consultations: 0,
        lastVisit: 'Sin consultas',
        medicalHistory: {
          ...emptyMedicalHistory,
          ...(newPatient.medicalHistory || {}),
        },
      },
      ...previous,
    ])
  }

  // ==========================================
  // ACTUALIZAR DATOS PERSONALES
  // ==========================================

  const updatePatient = (patientId, updatedData) => {
    setPatients((previous) =>
      previous.map((patient) =>
        patient.id === Number(patientId)
          ? {
              ...patient,
              ...updatedData,
            }
          : patient
      )
    )
  }

  // ==========================================
  // ACTUALIZAR ANTECEDENTES MÉDICOS
  // ==========================================

  const updateMedicalHistory = (patientId, medicalHistory) => {
    setPatients((previous) =>
      previous.map((patient) =>
        patient.id === Number(patientId)
          ? {
              ...patient,
              medicalHistory: {
                ...emptyMedicalHistory,
                ...patient.medicalHistory,
                ...medicalHistory,
              },
            }
          : patient
      )
    )
  }

  // ==========================================
  // ACTUALIZAR ESTADO DEL PACIENTE
  // ==========================================

  const updatePatientStatus = (patientId, newStatus) => {
    if (!['Activo', 'Inactivo'].includes(newStatus)) {
      return
    }

    setPatients((previous) =>
      previous.map((patient) =>
        patient.id === Number(patientId)
          ? {
              ...patient,
              status: newStatus,
            }
          : patient
      )
    )
  }

  // ==========================================
  // OBTENER CONSULTAS DE UN PACIENTE
  // ==========================================

  const getPatientConsultations = (patientId) => {
    return getSortedPatientConsultations(
      consultations,
      patientId
    )
  }

  // ==========================================
  // REGISTRAR NUEVA CONSULTA
  // ==========================================

  const addConsultation = (consultationData) => {
    const patientId = Number(consultationData.patientId)

    // Verificamos que el paciente exista.

    if (!patients.some((patient) => patient.id === patientId)) {
      return null
    }

    // Generamos el identificador de la nueva consulta.

    const newConsultation = {
      ...consultationData,
      id:
        consultations.length > 0
          ? Math.max(...consultations.map((item) => item.id)) + 1
          : 1,
      patientId,
    }

    // Agregamos la consulta al historial.

    const updatedConsultations = [
      newConsultation,
      ...consultations,
    ]

    setConsultations(updatedConsultations)

    // Calculamos el nuevo resumen del paciente.

    const updatedSummary = getConsultationSummary(
      updatedConsultations,
      patientId
    )

    // Actualizamos el contador y la última visita.

    setPatients((previous) =>
      previous.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              ...updatedSummary,
            }
          : patient
      )
    )

    return newConsultation
  }

  // ==========================================
  // CONTEXTO COMPARTIDO
  // ==========================================

  return (
    <PatientsContext.Provider
      value={{
        patients,
        consultations,
        getPatientById,
        addPatient,
        updatePatient,
        updateMedicalHistory,
        updatePatientStatus,
        getPatientConsultations,
        addConsultation,
      }}
    >
      {children}
    </PatientsContext.Provider>
  )
}

// ==========================================
// HOOK PERSONALIZADO
// ==========================================

export function usePatients() {
  const context = useContext(PatientsContext)

  if (!context) {
    throw new Error(
      'usePatients debe utilizarse dentro de PatientsProvider'
    )
  }

  return context
}