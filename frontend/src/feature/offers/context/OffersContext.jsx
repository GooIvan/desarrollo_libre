import { createContext, useCallback, useContext, useState } from "react";

const OffersContext = createContext();

export const OffersProvider = ({ children }) => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFlights = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost/desarrollo_libre/back-end/routes.php?accion=vuelosDisponibles`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Vuelos obtenidos en Offers:", data);
            
            // El backend devuelve {success: true, data: [...]}
            if (data.success && data.data) {
                setFlights(data.data);
            } else if (Array.isArray(data)) {
                // Por si acaso el backend devuelve directamente un array
                setFlights(data);
            } else {
                console.warn("Estructura de datos inesperada:", data);
                setFlights([]);
            }
            
        } catch (err) {
            console.error("Error fetching flights:", err);
            setError(err.message);
            setFlights([]);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    return (
        <OffersContext.Provider
            value={{ 
                flights, 
                fetchFlights, 
                loading, 
                error 
            }}
        >
            {children}
        </OffersContext.Provider>
    );
};

export const useOffers = () => useContext(OffersContext);
