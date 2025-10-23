import { useHome } from "../context/HomeContext";
import { useEffect } from "react";
import Navbar from '../../../shared/components/Navbar';
import FlightSearchForm from '../../../shared/components/FlightSearchForm';
import FlightCard from '../../../shared/components/FlightCard';
import FlightCardSkeleton from '../../../shared/components/FlightCardSkeleton';
import { useTranslation } from 'react-i18next';
import Footer from "../../../shared/components/Footer";

const HomePage = () => {
  const { economicFlights, fetchEconomicFlights, loading, error, searchFilters, clearSearch } = useHome();
  const { t } = useTranslation();

  useEffect(() => {
    fetchEconomicFlights();
  }, []);

  // Usar datos reales si están disponibles
  const flightsToShow = economicFlights ? economicFlights : [];

  return (
    <>
      <Navbar />
      <div className="container px-0 my-5">
        <h1 className="text-uppercase fw-bold mb-3 mt-3"> {t("home_title")} </h1>
        <FlightSearchForm />

        <h1 className="text-uppercase fw-bold mb-3 mt-5"> {t("home_subtitle")} </h1>

        {/* Indicador de filtros activos */}
        {searchFilters && (
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <div>
              <i className="bi bi-funnel me-2"></i>
              <strong>Filtros aplicados:</strong>
              {searchFilters.origin && <span className="ms-2 badge bg-secondary">Origen: {searchFilters.origin}</span>}
              {searchFilters.destination && <span className="ms-2 badge bg-secondary">Destino: {searchFilters.destination}</span>}
              {searchFilters.departureDate && <span className="ms-2 badge bg-secondary">Salida: {searchFilters.departureDate}</span>}
              {searchFilters.type && <span className="ms-2 badge bg-secondary">{searchFilters.type === 'roundTrip' ? 'Ida y vuelta' : 'Solo ida'}</span>}
            </div>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={clearSearch}
              title="Limpiar filtros"
            >
              <i className="bi bi-x-lg"></i> Limpiar
            </button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="row g-4">
            {[...Array(4)].map((_, index) => (
              <FlightCardSkeleton key={index} />
            ))}
          </div>
        ) : flightsToShow.length === 0 && !error ? (
          <div className="text-center py-5">
            <h5 className="text-muted"> No hay vuelos disponibles </h5>
            <button 
              className="btn btn-primary mt-3" 
              onClick={fetchEconomicFlights}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Recargar vuelos"}
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {flightsToShow.slice(0, 4).map((flight, index) => (
              <FlightCard 
                key={flight.IdVuelo || flight.id || index}
                flight={flight}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
      
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
      <script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>
    </>
  );
};

export default HomePage;