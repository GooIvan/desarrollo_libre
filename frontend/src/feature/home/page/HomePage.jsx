import { useHome } from "../context/HomeContext";
import { useEffect } from "react";
import Navbar from '../../../shared/components/Navbar';
import FlightSearchForm from '../../../shared/components/FlightSearchForm';
import FlightCard from '../../../shared/components/FlightCard';
import FlightCardSkeleton from '../../../shared/components/FlightCardSkeleton';
import { useTranslation } from 'react-i18next';
import Footer from "../../../shared/components/Footer";

const HomePage = () => {
  const { economicFlights, fetchEconomicFlights, loading } = useHome();
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

        {loading ? (
          <div className="row g-4">
            {[...Array(4)].map((_, index) => (
              <FlightCardSkeleton key={index} />
            ))}
          </div>
        ) : flightsToShow.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">No hay vuelos disponibles</h5>
          </div>
        ) : (
          <div className="row g-4">
            {flightsToShow.map((flight, index) => (
              <FlightCard 
                key={index}
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