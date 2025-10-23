import { useState } from "react";
import { useTranslation } from "react-i18next";

const PassengerForm = ({ onSubmit, loading }) => {
  const { t } = useTranslation();
  const [passengers, setPassengers] = useState([
    {
      IdPasajero: 1,
      NombreCompleto: '',
      Telefono: '',
      DocumentoIdentidad: '',
      Genero: '',
      TipoDocumento: '',
      FechaNacimiento: '',
      esPagante: false,
      // Campos temporales para el formulario
      firstName: '',
      lastName: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      nationality: '',
      // Campos adicionales para pagante
      email: ''
    }
  ]);

  const [errors, setErrors] = useState({});

  // Opciones para los selectores
  const genderOptions = [
    { value: '', label: t('select_gender') },
    { value: 'male', label: t('male') },
    { value: 'female', label: t('female') },
    { value: 'otro', label: t('other') }
  ];

  const dayOptions = [
    { value: '', label: t('day') },
    ...Array.from({ length: 31 }, (_, i) => ({ 
      value: i + 1, 
      label: (i + 1).toString().padStart(2, '0') 
    }))
  ];

  const monthOptions = [
    { value: '', label: t('month') },
    { value: '01', label: t('january') },
    { value: '02', label: t('february') },
    { value: '03', label: t('march') },
    { value: '04', label: t('april') },
    { value: '05', label: t('may') },
    { value: '06', label: t('june') },
    { value: '07', label: t('july') },
    { value: '08', label: t('august') },
    { value: '09', label: t('september') },
    { value: '10', label: t('october') },
    { value: '11', label: t('november') },
    { value: '12', label: t('december') }
  ];

  const yearOptions = [
    { value: '', label: t('year') },
    ...Array.from({ length: 100 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: year, label: year.toString() };
    })
  ];

  const documentTypeOptions = [
    { value: '', label: t('select_document_type') },
    { value: 'CC', label: t('cedula_citizenship') },
    { value: 'TI', label: t('identity_card') },
    { value: 'PA', label: t('passport') },
    { value: 'CE', label: t('foreign_id') },
    { value: 'RC', label: t('birth_certificate') }
  ];

  const handleInputChange = (passengerId, field, value) => {
    // Caso especial para esPagante - manejar fuera del map para evitar conflictos
    if (field === 'esPagante') {
      setPassengers(prev => 
        prev.map(passenger => ({
          ...passenger,
          esPagante: passenger.IdPasajero === passengerId ? value : false
        }))
      );
      return;
    }

    // Para todos los otros campos
    setPassengers(prev => 
      prev.map(passenger => {
        if (passenger.IdPasajero === passengerId) {
          const updatedPassenger = { ...passenger, [field]: value };
          
          // Actualizar automáticamente los campos del formato requerido
          if (field === 'firstName' || field === 'lastName') {
            const firstName = field === 'firstName' ? value : passenger.firstName;
            const lastName = field === 'lastName' ? value : passenger.lastName;
            updatedPassenger.NombreCompleto = `${firstName} ${lastName}`.trim();
          }
          
          if (field === 'birthDay' || field === 'birthMonth' || field === 'birthYear') {
            const day = field === 'birthDay' ? value : passenger.birthDay;
            const month = field === 'birthMonth' ? value : passenger.birthMonth;
            const year = field === 'birthYear' ? value : passenger.birthYear;
            
            if (day && month && year) {
              updatedPassenger.FechaNacimiento = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
          }
          
          return updatedPassenger;
        }
        return passenger;
      })
    );
    
    // Limpiar error si existe
    if (errors[`${passengerId}_${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${passengerId}_${field}`];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    passengers.forEach(passenger => {
      const requiredFields = ['Genero', 'firstName', 'lastName', 'birthDay', 'birthMonth', 'birthYear', 'nationality'];
      
      requiredFields.forEach(field => {
        if (!passenger[field]) {
          newErrors[`${passenger.IdPasajero}_${field}`] = t('field_required');
        }
      });

      // Validación específica para nombre y apellido
      if (passenger.firstName && passenger.firstName.length < 2) {
        newErrors[`${passenger.IdPasajero}_firstName`] = t('min_length_2');
      }
      if (passenger.lastName && passenger.lastName.length < 2) {
        newErrors[`${passenger.IdPasajero}_lastName`] = t('min_length_2');
      }

      // Validación de teléfono
      if (passenger.Telefono && !/^\+?[\d\s-()]{8,15}$/.test(passenger.Telefono)) {
        newErrors[`${passenger.IdPasajero}_Telefono`] = t('invalid_phone');
      }

      // Validación de documento
      if (passenger.DocumentoIdentidad && passenger.DocumentoIdentidad.length < 5) {
        newErrors[`${passenger.IdPasajero}_DocumentoIdentidad`] = t('invalid_document');
      }

      // Validación de nacionalidad
      if (passenger.nationality && passenger.nationality.length < 2) {
        newErrors[`${passenger.IdPasajero}_nationality`] = t('min_length_2');
      }

      // Validación de edad mínima
      if (passenger.birthDay && passenger.birthMonth && passenger.birthYear) {
        const birthDate = new Date(passenger.birthYear, passenger.birthMonth - 1, passenger.birthDay);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 0 || (age === 0 && today < birthDate)) {
          newErrors[`${passenger.IdPasajero}_birthDate`] = t('invalid_birth_date');
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Guardar pasajeros temporalmente en localStorage
      localStorage.setItem('tempPassengers', JSON.stringify(passengers));
      
      // Llamar la función onSubmit pasada como prop para continuar al siguiente paso
      if (onSubmit) {
        onSubmit(passengers);
      }
    }
  };

  const addPassenger = () => {
    // Limitar a máximo 5 pasajeros
    if (passengers.length >= 5) {
      alert(t('max_passengers_reached'));
      return;
    }

    const newPassenger = {
      IdPasajero: passengers.length + 1,
      NombreCompleto: '',
      Telefono: '',
      DocumentoIdentidad: '',
      Genero: '',
      TipoDocumento: '',
      FechaNacimiento: '',
      esPagante: false,
      // Campos temporales para el formulario
      firstName: '',
      lastName: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      nationality: '',
      // Campos adicionales para pagante
      email: ''
    };
    setPassengers([...passengers, newPassenger]);
  };

  const removePassenger = (passengerId) => {
    if (passengers.length > 1) {
      setPassengers(prev => prev.filter(p => p.IdPasajero !== passengerId));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {passengers.map((passenger, index) => (
        <div key={passenger.IdPasajero} className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-header bg-light border-0 rounded-top-4 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#6f42c1' }}>
                {t('passenger')} {index + 1}:
              </h5>
              {passengers.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removePassenger(passenger.IdPasajero)}
                >
                  <i className="bi bi-trash"></i> {t('remove')}
                </button>
              )}
            </div>
          </div>
          
          <div className="card-body p-4">
            <div className="row">
              {/* Género */}
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">
                  {t('gender')}*
                </label>
                <select
                  className={`form-select ${errors[`${passenger.IdPasajero}_Genero`] ? 'is-invalid' : ''}`}
                  value={passenger.Genero || ''}
                  onChange={(e) => handleInputChange(passenger.IdPasajero, 'Genero', e.target.value)}
                >
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors[`${passenger.IdPasajero}_Genero`] && (
                  <div className="invalid-feedback">
                    {errors[`${passenger.IdPasajero}_Genero`]}
                  </div>
                )}
              </div>

              {/* Nombre */}
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">
                  {t('first_name')}*
                </label>
                <input
                  type="text"
                  className={`form-control ${errors[`${passenger.IdPasajero}_firstName`] ? 'is-invalid' : ''}`}
                  placeholder={t('first_name_placeholder')}
                  value={passenger.firstName || ''}
                  onChange={(e) => handleInputChange(passenger.IdPasajero, 'firstName', e.target.value)}
                />
                {errors[`${passenger.IdPasajero}_firstName`] && (
                  <div className="invalid-feedback">
                    {errors[`${passenger.IdPasajero}_firstName`]}
                  </div>
                )}
              </div>

              {/* Apellido */}
              <div className="col-md-5 mb-3">
                <label className="form-label fw-semibold">
                  {t('last_name')}*
                </label>
                <input
                  type="text"
                  className={`form-control ${errors[`${passenger.IdPasajero}_lastName`] ? 'is-invalid' : ''}`}
                  placeholder={t('last_name_placeholder')}
                  value={passenger.lastName || ''}
                  onChange={(e) => handleInputChange(passenger.IdPasajero, 'lastName', e.target.value)}
                />
                {errors[`${passenger.IdPasajero}_lastName`] && (
                  <div className="invalid-feedback">
                    {errors[`${passenger.IdPasajero}_lastName`]}
                  </div>
                )}
              </div>
            </div>

            {/* Fecha de nacimiento */}
            <div className="row">
              <div className="col-12 mb-2">
                <label className="form-label fw-semibold">
                  {t('birth_date')}*
                </label>
              </div>
              <div className="col-md-3 mb-3">
                <select
                  className={`form-select ${errors[`${passenger.IdPasajero}_birthDay`] ? 'is-invalid' : ''}`}
                  value={passenger.birthDay || ''}
                  onChange={(e) => handleInputChange(passenger.IdPasajero, 'birthDay', e.target.value)}
                >
                  {dayOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <select
                  className={`form-select ${errors[`${passenger.IdPasajero}_birthMonth`] ? 'is-invalid' : ''}`}
                  value={passenger.birthMonth || ''}
                  onChange={(e) => handleInputChange(passenger.IdPasajero, 'birthMonth', e.target.value)}
                >
                  {monthOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-5 mb-3">
                <select
                  className={`form-select ${errors[`${passenger.IdPasajero}_birthYear`] ? 'is-invalid' : ''}`}
                  value={passenger.birthYear || ''}
                  onChange={(e) => handleInputChange(passenger.IdPasajero, 'birthYear', e.target.value)}
                >
                  {yearOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors[`${passenger.IdPasajero}_birthDate`] && (
                <div className="col-12">
                  <div className="text-danger small">
                    {errors[`${passenger.IdPasajero}_birthDate`]}
                  </div>
                </div>
              )}
            </div>

            {/* Nacionalidad */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  {t('travel_document_nationality')}*
                </label>
                <input
                  type="text"
                  className={`form-control ${errors[`${passenger.IdPasajero}_nationality`] ? 'is-invalid' : ''}`}
                  value={passenger.nationality || ''}
                  onChange={(e) => handleInputChange(passenger.IdPasajero, 'nationality', e.target.value)}
                  placeholder={t('enter_nationality')}
                />
                {errors[`${passenger.IdPasajero}_nationality`] && (
                  <div className="invalid-feedback">
                    {errors[`${passenger.IdPasajero}_nationality`]}
                  </div>
                )}
              </div>
            </div>

            {/* Checkbox Es Pagante */}
            <div className="row">
              <div className="col-12 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`esPagante_${passenger.IdPasajero}`}
                    checked={passenger.esPagante || false}
                    onChange={(e) => handleInputChange(passenger.IdPasajero, 'esPagante', e.target.checked)}
                  />
                  <label className="form-check-label fw-semibold" htmlFor={`esPagante_${passenger.IdPasajero}`}>
                    Es pagante de la reserva
                  </label>
                </div>
              </div>
            </div>

            {/* Campos adicionales para pagante */}
            {passenger.esPagante && (
              <div className="row">
                <div className="col-12 mb-3">
                  <h6 className="fw-semibold text-primary mb-3">Información de contacto del pagante</h6>
                </div>
                
                {/* Teléfono */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Teléfono*
                  </label>
                  <input
                    type="tel"
                    className={`form-control ${errors[`${passenger.IdPasajero}_Telefono`] ? 'is-invalid' : ''}`}
                    placeholder="Ingrese su número de teléfono"
                    value={passenger.Telefono || ''}
                    onChange={(e) => handleInputChange(passenger.IdPasajero, 'Telefono', e.target.value)}
                  />
                  {errors[`${passenger.IdPasajero}_Telefono`] && (
                    <div className="invalid-feedback">
                      {errors[`${passenger.IdPasajero}_Telefono`]}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Email*
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors[`${passenger.IdPasajero}_email`] ? 'is-invalid' : ''}`}
                    placeholder="ejemplo@correo.com"
                    value={passenger.email || ''}
                    onChange={(e) => handleInputChange(passenger.IdPasajero, 'email', e.target.value)}
                  />
                  {errors[`${passenger.IdPasajero}_email`] && (
                    <div className="invalid-feedback">
                      {errors[`${passenger.IdPasajero}_email`]}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Botones de acción */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            type="button"
            className={`btn ${passengers.length >= 5 ? 'btn-secondary' : 'btn-outline-primary'}`}
            onClick={addPassenger}
            disabled={passengers.length >= 5}
          >
            <i className="bi bi-plus-circle me-2"></i>
            {t('add_passenger')}
          </button>
          {passengers.length >= 5 && (
            <div className="small text-muted mt-1">
              {t('max_passengers_info')}
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="btn text-white fw-semibold px-4 py-2"
            style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {t('saving')}
              </>
            ) : (
              t('continue')
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PassengerForm;