import defaultCityImage from "../../assets/images/city_empty.webp";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const FlightCard = ({ flight, index }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/flights/${flight.idVuelo || flight.IdVuelo || index}`);
  };
  
  return (
    <div key={index} className="col-lg-3 col-md-4 col-sm-6">
      <div 
        className="p-3 card h-100 shadow border rounded-4 overflow-hidden"
        onClick={handleCardClick}
        style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }}
      >
        {/* Imagen del destino */}
        <div className="position-relative">
          <img 
            src={flight.imagen || flight.Imagen || defaultCityImage}
            className="card-img-top" 
            alt={flight.destino || flight.Destino}
            style={{ height: '200px', objectFit: 'cover', borderRadius: '1rem' }}
          />
        </div>
        
        {/* Contenido de la card */}
        <div className="card-body">
          <h3 className="card-title fw-bold mb-2" style={{ color: '#2c3e50' }}>
            {flight.destino || flight.Destino}
          </h3>

          <p className="text-muted mb-2 small">
            {flight.duracion || flight.Duracion || `${t("from")}: ${flight.Origen || 'N/A'}`}
          </p>
          
          <p className="text-muted mb-2 small">
            {flight.fechas || flight.Fechas || `${t("takesoff")}: ${flight.FechaSalida || "Próximas fechas"}`}
          </p>
          
          <div className="d-flex flex-column gap-3">
            <div>
              <p className="mb-0 fw-bold" style={{ fontSize: '1.2rem', color: '#2c3e50' }}>
                {t("from")} ${(flight.precio || flight.PrecioIda || 0).toLocaleString('es-CO')}
              </p>
            </div>
            
            <button 
              className="btn btn-sm text-white fw-semibold rounded-3 px-3"
              style={{ 
                backgroundColor: '#6f42c1', 
                borderColor: '#6f42c1' 
              }}
              onClick={(e) => {
                e.stopPropagation(); // Evitar que se dispare el click del div padre
                handleCardClick();
              }}
            >
              {t("view_more")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;