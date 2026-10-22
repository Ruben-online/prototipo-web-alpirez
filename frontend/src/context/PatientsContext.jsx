import { useState, useEffect, useCallback } from 'react'
import { PatientsContext } from './patientsContext'
import { supabase } from '../supabase'

// ==========================================
// FUNCIONES DE MAPEÓ (DB <-> Frontend)
// ==========================================

const mapPatientFromDB = (p) => ({
  id: p.id,
  name: p.full_name,
  initials: p.full_name ? p.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??',
  email: p.email,
  phone: p.phone,
  birthDate: p.birth_date,
  sex: p.sex,
  address: p.address,
  status: p.status,
  createdAt: p.created_at,
  consultations: p.consultations_count?.[0]?.count || 0,
  lastVisit: p.last_consultation?.[0]?.consultation_date || null,
  medicalHistory: p.medical_history ? {
    allergies: p.medical_history.allergies,
    conditions: p.medical_history.conditions,
    medications: p.medical_history.medications,
    dermatologicalHistory: p.medical_history.dermatological_history,
    observations: p.medical_history.observations,
  } : {
    allergies: '',
    conditions: '',
    medications: '',
    dermatologicalHistory: '',
    observations: '',
  }
})

// ==========================================
// PROVIDER
// ==========================================

export function PatientsProvider({ children }) {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          medical_history:patient_medical_history(*),
          consultations_count:consultations(count),
          last_consultation:consultations(consultation_date)
        `)
        .order('full_name', { ascending: true })

      if (error) throw error

      const processedData = data.map(p => {
        if (p.last_consultation && p.last_consultation.length > 0) {
          p.last_consultation.sort((a, b) => 
            new Date(b.consultation_date) - new Date(a.consultation_date)
          )
        }
        return mapPatientFromDB(p)
      })

      setPatients(processedData)
    } catch (err) {
      console.error('Error fetching patients:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const getPatientById = (id) => {
    return patients.find(p => p.id === Number(id))
  }

  const addPatient = async (newPatient) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([{
          full_name: newPatient.name,
          birth_date: newPatient.birthDate,
          sex: newPatient.sex,
          phone: newPatient.phone,
          email: newPatient.email,
          address: newPatient.address,
          status: 'Activo'
        }])
        .select()

      if (error) throw error
      await fetchPatients()
      return data[0]
    } catch (err) {
      console.error('Error adding patient:', err)
      throw err
    }
  }

  const updatePatient = async (patientId, updatedData) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({
          full_name: updatedData.name,
          birth_date: updatedData.birthDate,
          sex: updatedData.sex,
          phone: updatedData.phone,
          email: updatedData.email,
          address: updatedData.address
        })
        .eq('id', patientId)

      if (error) throw error
      await fetchPatients()
    } catch (err) {
      console.error('Error updating patient:', err)
      throw err
    }
  }

  const updateMedicalHistory = async (patientId, history) => {
    try {
      const { error } = await supabase
        .from('patient_medical_history')
        .update({
          allergies: history.allergies,
          conditions: history.conditions,
          medications: history.medications,
          dermatological_history: history.dermatologicalHistory,
          observations: history.observations
        })
        .eq('patient_id', patientId)

      if (error) throw error
      await fetchPatients()
    } catch (err) {
      console.error('Error updating medical history:', err)
      throw err
    }
  }

  const updatePatientStatus = async (patientId, newStatus) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ status: newStatus })
        .eq('id', patientId)

      if (error) throw error
      await fetchPatients()
    } catch (err) {
      console.error('Error updating status:', err)
      throw err
    }
  }

  const getPatientConsultations = async (patientId) => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('patient_id', patientId)
        .order('consultation_date', { ascending: false })

      if (error) throw error
      
      return data.map(c => ({
        id: c.id,
        patientId: c.patient_id,
        date: c.consultation_date,
        reason: c.reason,
        diagnosis: c.diagnosis,
        treatment: c.treatment,
        observations: c.observations,
        followUpDate: c.follow_up_date
      }))
    } catch (err) {
      console.error('Error fetching consultations:', err)
      return []
    }
  }

  const addConsultation = async (consultationData) => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([{
          patient_id: consultationData.patientId,
          consultation_date: consultationData.date,
          reason: consultationData.reason,
          diagnosis: consultationData.diagnosis,
          treatment: consultationData.treatment,
          observations: consultationData.observations,
          follow_up_date: consultationData.followUpDate || null
        }])
        .select()

      if (error) throw error
      await fetchPatients()
      return data[0]
    } catch (err) {
      console.error('Error adding consultation:', err)
      throw err
    }
  }

  return (
    <PatientsContext.Provider
      value={{
        patients,
        loading,
        error,
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