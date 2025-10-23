import { createContext, useCallback, useContext, useState, useEffect } from "react";

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
    const [flights, setFlights] = useState([]);
    const [currentFlight, setCurrentFlight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pendingFlightId, setPendingFlightId] = useState(null);

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
            console.log("Vuelos obtenidos en FlightContext:", data);
            
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

    const getFlightById = useCallback((id) => {
        if (flights.length === 0) {
            setPendingFlightId(id);
            return null;
        }

        let flight = flights.find(f =>
            f.IdVuelo?.toString() === id ||
            f.idVuelo?.toString() === id
        );

        if (!flight && flights.length > 0) {
            const index = parseInt(id);
            flight = flights[index];
        }

        setCurrentFlight(flight || null);
        setPendingFlightId(null);
        return flight || null;
    }, [flights]);

    useEffect(() => {
        if (pendingFlightId && flights.length > 0) {
            getFlightById(pendingFlightId);
        }
    }, [flights, pendingFlightId, getFlightById]);

    const initializeFlights = useCallback(() => {
        if (flights.length === 0 && !loading) {
            fetchFlights();
        }
    }, [flights.length, loading, fetchFlights]);

    return (
        <FlightContext.Provider
            value={{
                flights,
                currentFlight,
                loading,
                error,
                fetchFlights,
                getFlightById,
                initializeFlights,
                pendingFlightId
            }}
        >
            {children}
        </FlightContext.Provider>
    );
};

export const useFlight = () => useContext(FlightContext);
