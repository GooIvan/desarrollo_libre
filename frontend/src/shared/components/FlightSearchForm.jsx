import { useState } from "react";
import { useTranslation } from 'react-i18next';

const FlightSearchForm = () => {
  const [selected, setSelected] = useState("roundTrip");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [originInput, setOriginInput] = useState("Bogotá (BOG)");
  const [destinationInput, setDestinationInput] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const { t } = useTranslation();

  // Lista de ciudades y aeropuertos
  const cities = [
    { name: "Bogotá", code: "BOG", country: "Colombia" },
    { name: "Medellín", code: "MDE", country: "Colombia" },
    { name: "Cali", code: "CLO", country: "Colombia" },
    { name: "Cartagena", code: "CTG", country: "Colombia" },
    { name: "Barranquilla", code: "BAQ", country: "Colombia" },
    { name: "Bucaramanga", code: "UIO", country: "Colombia" },
    { name: "Madrid", code: "MAD", country: "España" },
    { name: "Barcelona", code: "BCN", country: "España" },
    { name: "París", code: "CDG", country: "Francia" },
    { name: "Londres", code: "LHR", country: "Reino Unido" },
    { name: "Nueva York", code: "JFK", country: "Estados Unidos" },
    { name: "Los Ángeles", code: "LAX", country: "Estados Unidos" },
    { name: "Miami", code: "MIA", country: "Estados Unidos" },
    { name: "México DF", code: "MEX", country: "México" },
    { name: "Buenos Aires", code: "EZE", country: "Argentina" },
    { name: "São Paulo", code: "GRU", country: "Brasil" },
    { name: "Lima", code: "LIM", country: "Perú" },
    { name: "Santiago", code: "SCL", country: "Chile" }
  ];

  // Función para filtrar ciudades
  const filterCities = (input) => {
    if (!input || input.length < 2) return [];
    return cities.filter(city => 
      city.name.toLowerCase().includes(input.toLowerCase()) ||
      city.code.toLowerCase().includes(input.toLowerCase()) ||
      city.country.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5);
  };

  // Handlers para origen
  const handleOriginInputChange = (e) => {
    const value = e.target.value;
    setOriginInput(value);
    const suggestions = filterCities(value);
    setOriginSuggestions(suggestions);
    setShowOriginSuggestions(suggestions.length > 0);
  };

  const handleOriginSuggestionClick = (city) => {
    setOriginInput(`${city.name} (${city.code})`);
    setShowOriginSuggestions(false);
    setOriginSuggestions([]);
  };

  // Handlers para destino
  const handleDestinationInputChange = (e) => {
    const value = e.target.value;
    setDestinationInput(value);
    const suggestions = filterCities(value);
    setDestinationSuggestions(suggestions);
    setShowDestinationSuggestions(suggestions.length > 0);
  };

  const handleDestinationSuggestionClick = (city) => {
    setDestinationInput(`${city.name} (${city.code})`);
    setShowDestinationSuggestions(false);
    setDestinationSuggestions([]);
  };

  // Obtener fechas para restricciones
  const today = new Date();
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(today.getMonth() + 2);

  // Formatear fechas para inputs
  const minDate = today.toISOString().split('T')[0];
  const maxDate = twoMonthsFromNow.toISOString().split('T')[0];
  
  // Fecha por defecto (mañana)
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const defaultDeparture = tomorrow.toISOString().split('T')[0];
  
  // Fecha de vuelta por defecto (una semana después)
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const defaultReturn = nextWeek.toISOString().split('T')[0];

  const handleSearch = () => {
    const searchData = {
      type: selected,
      origin: originInput,
      destination: destinationInput,
      departureDate: departureDate || defaultDeparture,
      returnDate: selected === "roundTrip" ? (returnDate || defaultReturn) : null
    };
    
    console.log('Búsqueda de vuelos:', searchData);
    // Aquí iría la lógica de búsqueda
  };

  return (
    <div className="shadow-sm p-4 border rounded-5 w-100">
      {/* Opciones de vuelo */}
      <div className="p-2 rounded-5 border d-inline-block shadow-sm mb-4">
        <div className="form-check form-check-inline custom-checkbox">
          <input
            className="form-check-input"
            type="checkbox"
            id="roundTrip"
            checked={selected === "roundTrip"}
            onChange={() => setSelected("roundTrip")}
          />
          <label className="form-check-label" htmlFor="roundTrip">
            {t('roundtrip')}
          </label>
        </div>

        <div className="form-check form-check-inline custom-checkbox">
          <input
            className="form-check-input"
            type="checkbox"
            id="oneWay"
            checked={selected === "oneWay"}
            onChange={() => setSelected("oneWay")}
          />
          <label className="form-check-label" htmlFor="oneWay">
            {t('oneway')}
          </label>
        </div>
      </div>

      {/* Formulario de búsqueda */}
      <div className="row g-3 align-items-end">
        {/* Origen */}
        <div className="col-md-3">
          <div className="form-group position-relative">
            <label className="form-label text-muted small">
              <i className="bi bi-airplane-engines me-1"></i>
              {t('origin')}
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-lg border-0 bg-light"
                placeholder="Bogotá (BOG)"
                value={originInput}
                onChange={handleOriginInputChange}
                onFocus={() => {
                  if (originSuggestions.length > 0) {
                    setShowOriginSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowOriginSuggestions(false), 200);
                }}
              />
            </div>
            {/* Sugerencias de origen */}
            {showOriginSuggestions && originSuggestions.length > 0 && (
              <div 
                className="position-absolute w-100 bg-white border rounded-3 shadow-lg"
                style={{ top: '100%', zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
              >
                {originSuggestions.map((city, index) => (
                  <div
                    key={index}
                    className="p-3 border-bottom cursor-pointer suggestion-item"
                    onClick={() => handleOriginSuggestionClick(city)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{city.name}</strong> ({city.code})
                        <br />
                        <small className="text-muted">{city.country}</small>
                      </div>
                      <i className="bi bi-airplane text-muted"></i>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Destino */}
        <div className="col-md-3">
          <div className="form-group position-relative">
            <label className="form-label text-muted small">
              <i className="bi bi-geo-alt me-1"></i>
              {t('destination')}
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-lg border-0 bg-light"
                placeholder={t('select_destination')}
                value={destinationInput}
                onChange={handleDestinationInputChange}
                onFocus={() => {
                  if (destinationSuggestions.length > 0) {
                    setShowDestinationSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowDestinationSuggestions(false), 200);
                }}
              />
            </div>
            {/* Sugerencias de destino */}
            {showDestinationSuggestions && destinationSuggestions.length > 0 && (
              <div 
                className="position-absolute w-100 bg-white border rounded-3 shadow-lg"
                style={{ top: '100%', zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
              >
                {destinationSuggestions.map((city, index) => (
                  <div
                    key={index}
                    className="p-3 border-bottom cursor-pointer suggestion-item"
                    onClick={() => handleDestinationSuggestionClick(city)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{city.name}</strong> ({city.code})
                        <br />
                        <small className="text-muted">{city.country}</small>
                      </div>
                      <i className="bi bi-geo-alt text-muted"></i>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fecha de ida */}
        <div className="col-md-2">
          <div className="form-group">
            <label className="form-label text-muted small">
              <i className="bi bi-calendar3 me-1"></i>
              {t('departure')}
            </label>
            <div className="input-group">
              <input
                type="date"
                className="form-control form-control-lg border-0 bg-light"
                min={minDate}
                max={maxDate}
                value={departureDate || defaultDeparture}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Fecha de vuelta (solo si es ida y vuelta) */}
        {selected === "roundTrip" && (
          <div className="col-md-2">
            <div className="form-group">
              <label className="form-label text-muted small">
                <i className="bi bi-calendar3 me-1"></i>
                {t('return')}
              </label>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control form-control-lg border-0 bg-light"
                  min={departureDate || minDate}
                  max={maxDate}
                  value={returnDate || defaultReturn}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pasajeros */}
        <div className="col-md-2">
          <div className="form-group">
            <label className="form-label text-muted small">
              <i className="bi bi-people me-1"></i>
              {t('passengers')}
            </label>
            <div className="input-group">
              <select className="form-select form-select-lg border-0 bg-light">
                <option value="1">1 {t('passenger')}</option>
                <option value="2">2 {t('passengers')}</option>
                <option value="3">3 {t('passengers')}</option>
                <option value="4">4 {t('passengers')}</option>
                <option value="5">5+ {t('passengers')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botón de búsqueda */}
        <div className="col-md-2">
          <button 
            className="btn btn-dark btn-lg w-100 rounded-4"
            style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
            onClick={handleSearch}
          >
            {t('search')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchForm;
