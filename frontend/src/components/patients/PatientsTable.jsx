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
          {patients.map((patient) => {
            const isActive = patient.status === 'Activo'

            return (
              <tr key={patient.id}>
                {/* PACIENTE */}

                <td data-label="Paciente">
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

                <td data-label="Contacto">
                  <div className="patients-contact">
                    <span>
                      {patient.email || 'Sin correo registrado'}
                    </span>

                    <small>
                      {patient.phone || 'Sin teléfono registrado'}
                    </small>
                  </div>
                </td>

                {/* ÚLTIMA CONSULTA */}

                <td data-label="Última consulta">
                  <div className="patients-date">
                    <Clock3 size={17} strokeWidth={1.8} />

                    <span>
                      {patient.lastVisit || 'Sin consultas'}
                    </span>
                  </div>
                </td>

                {/* CONSULTAS */}

                <td data-label="Consultas">
                  <span className="patients-consultations">
                    {patient.consultations ?? 0}
                  </span>
                </td>

                {/* ESTADO */}

                <td data-label="Estado">
                  <span
                    className={`patients-status ${
                      isActive ? 'active' : 'inactive'
                    }`}
                  >
                    <span className="patients-status-dot" />

                    {patient.status}
                  </span>
                </td>

                {/* ACCIONES */}

                <td data-label="Acciones">
                  <div className="patients-row-actions">
                    {/* VER EXPEDIENTE */}

                    <button
                      type="button"
                      className="patients-view-button"
                      title={`Ver expediente de ${patient.name}`}
                      onClick={() => onViewPatient(patient.id)}
                    >
                      <FileText size={17} strokeWidth={1.8} />

                      <span>Ver expediente</span>
                    </button>

                    {/* EDITAR */}

                    <button
                      type="button"
                      className="patients-edit-button"
                      title={`Editar a ${patient.name}`}
                      aria-label={`Editar a ${patient.name}`}
                      onClick={() => onEditPatient(patient)}
                    >
                      <Pencil size={17} strokeWidth={1.8} />

                      <span>Editar</span>
                    </button>

                    {/* ACTIVAR / DESACTIVAR */}

                    <button
                      type="button"
                      className={`patients-toggle-button ${
                        isActive ? 'deactivate' : 'activate'
                      }`}
                      title={
                        isActive
                          ? `Desactivar a ${patient.name}`
                          : `Activar a ${patient.name}`
                      }
                      aria-label={
                        isActive
                          ? `Desactivar a ${patient.name}`
                          : `Activar a ${patient.name}`
                      }
                      onClick={() => onTogglePatientStatus(patient)}
                    >
                      {isActive ? (
                        <>
                          <UserRoundX size={17} strokeWidth={1.8} />
                          <span>Desactivar</span>
                        </>
                      ) : (
                        <>
                          <UserRoundCheck size={17} strokeWidth={1.8} />
                          <span>Activar</span>
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}

          {/* SIN RESULTADOS */}

          {patients.length === 0 && (
            <tr className="patients-empty-row">
              <td colSpan={6}>
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