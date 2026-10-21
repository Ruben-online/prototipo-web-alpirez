import {
  Clock3,
  FileText,
  Pencil,
  Search,
  UserRoundCheck,
  UserRoundX,
} from 'lucide-react'

// ==========================================
// TABLA DE PACIENTES
// ==========================================

function PatientsTable({
  patients,
  onViewPatient,
  onEditPatient,
  onTogglePatientStatus,
}) {
  return (
    <div className="patients-table-wrapper">

      <table className="patients-table">

        <thead>
          <tr>
            <th>PACIENTE</th>
            <th>CONTACTO</th>
            <th>ÚLTIMA CONSULTA</th>
            <th>CONSULTAS</th>
            <th>ESTADO</th>
            <th>ACCIONES</th>
          </tr>
        </thead>

        <tbody>

          {patients.map((patient) => (
            <tr key={patient.id}>

              {/* PACIENTE */}

              <td>
                <div className="patients-person">

                  <div className="patients-avatar">
                    {patient.initials}
                  </div>

                  <div className="patients-person-info">
                    <strong>{patient.name}</strong>

                    <span>
                      ID #{String(patient.id).padStart(4, '0')}
                    </span>
                  </div>

                </div>
              </td>

              {/* CONTACTO */}

              <td>
                <div className="patients-contact">
                  <span>{patient.email}</span>
                  <small>{patient.phone}</small>
                </div>
              </td>

              {/* ÚLTIMA CONSULTA */}

              <td>
                <div className="patients-date">
                  <Clock3 size={15} strokeWidth={1.8} />
                  <span>{patient.lastVisit}</span>
                </div>
              </td>

              {/* CONSULTAS */}

              <td>
                <span className="patients-consultations">
                  {patient.consultations}
                </span>
              </td>

              {/* ESTADO */}

              <td>
                <span
                  className={`patients-status ${
                    patient.status === 'Activo'
                      ? 'active'
                      : 'inactive'
                  }`}
                >
                  <span className="patients-status-dot" />
                  {patient.status}
                </span>
              </td>

              {/* ACCIONES */}

              <td>
                <div className="patients-row-actions">

                  {/* VER EXPEDIENTE */}

                  <button
                    type="button"
                    className="patients-view-button"
                    title={`Ver expediente de ${patient.name}`}
                    onClick={() => onViewPatient(patient.id)}
                  >
                    <FileText size={16} strokeWidth={1.8} />
                    <span>Ver expediente</span>
                  </button>

                  {/* EDITAR PACIENTE */}

                  <button
                    type="button"
                    className="patients-edit-button"
                    title={`Editar a ${patient.name}`}
                    aria-label={`Editar a ${patient.name}`}
                    onClick={() => onEditPatient(patient)}
                  >
                    <Pencil size={15} strokeWidth={1.8} />
                  </button>

                  {/* ACTIVAR / DESACTIVAR */}

                  <button
                    type="button"
                    className={`patients-toggle-button ${
                      patient.status === 'Activo'
                        ? 'deactivate'
                        : 'activate'
                    }`}
                    title={
                      patient.status === 'Activo'
                        ? `Desactivar a ${patient.name}`
                        : `Activar a ${patient.name}`
                    }
                    aria-label={
                      patient.status === 'Activo'
                        ? `Desactivar a ${patient.name}`
                        : `Activar a ${patient.name}`
                    }
                    onClick={() => onTogglePatientStatus(patient)}
                  >
                    {patient.status === 'Activo' ? (
                      <UserRoundX size={16} strokeWidth={1.8} />
                    ) : (
                      <UserRoundCheck size={16} strokeWidth={1.8} />
                    )}
                  </button>

                </div>
              </td>

            </tr>
          ))}

          {/* SIN RESULTADOS */}

          {patients.length === 0 && (
            <tr>
              <td colSpan="6">
                <div className="patients-empty">
                  <Search size={27} strokeWidth={1.5} />

                  <strong>No encontramos pacientes</strong>

                  <p>
                    Prueba con otro nombre o cambia los filtros.
                  </p>
                </div>
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  )
}

export default PatientsTable