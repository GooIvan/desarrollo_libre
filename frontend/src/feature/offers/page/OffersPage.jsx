import Footer from '../../../shared/components/Footer';
import Navbar from '../../../shared/components/Navbar';

import { useOffers } from "../context/OffersContext";
import { useEffect } from "react";
import FlightCard from '../../../shared/components/FlightCard';
import FlightCardSkeleton from '../../../shared/components/FlightCardSkeleton';
import { useTranslation } from 'react-i18next';

const OffersPage = () => {
    const { t } = useTranslation();
    const { flights, loading, fetchFlights, error } = useOffers();

    useEffect(() => {
        fetchFlights();
    }, []);

    // Usar datos reales si están disponibles
    const flightsToShow = flights ? flights : [];

    return (
        <>
            <Navbar />
            <div className="container px-0 my-5">
                <h1 className="text-uppercase fw-bold mb-3 mt-3"> {t("offers_title")} </h1>

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
                        <h5 className="text-muted"> {t("no_offers") || "No hay ofertas disponibles"} </h5>
                        <button 
                            className="btn btn-primary mt-3" 
                            onClick={fetchFlights}
                            disabled={loading}
                        >
                            {loading ? "Cargando..." : "Recargar ofertas"}
                        </button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {flightsToShow.map((flight, index) => (
                        <FlightCard 
                            key={flight.IdVuelo || flight.id || index}
                            flight={flight}
                            index={index}
                        />
                    ))}
                    </div>
                )}
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
            <script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>

            <Footer />
        </>
    );
};

export default OffersPage;