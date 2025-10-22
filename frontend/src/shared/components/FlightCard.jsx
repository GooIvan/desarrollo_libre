import defaultCityImage from "../../assets/images/city_empty.webp";
import { useTranslation } from 'react-i18next';

const FlightCard = ({ flight, index }) => {
  const { t } = useTranslation();
  
  return (
    <div key={index} className="col-lg-3 col-md-4 col-sm-6">
      <div className="p-3 card h-100 shadow border rounded-4 overflow-hidden">
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
              onClick={() => {
                // Aquí puedes agregar la lógica para ver más detalles
                console.log('Ver más detalles de:', flight.destino || flight.Destino);
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