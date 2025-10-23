import { createContext, useCallback, useContext, useState } from "react";

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
    const [economicFlights, setEconomicFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchFilters, setSearchFilters] = useState(null);

    const fetchEconomicFlights = useCallback(async () => {
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
            console.log("Respuesta completa del servidor:", data);
            
            // El backend devuelve {success: true, data: [...]}
            if (data.success && data.data) {
                setEconomicFlights(data.data);
            } else if (Array.isArray(data)) {
                // Por si acaso el backend devuelve directamente un array
                setEconomicFlights(data);
            } else {
                console.warn("Estructura de datos inesperada:", data);
                setEconomicFlights([]);
            }
            
        } catch (err) {
            console.error("Error fetching flights:", err);
            setError(err.message);
            setEconomicFlights([]);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const searchFlights = useCallback(async (searchParams) => {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            // Construir parámetros de URL
            const params = new URLSearchParams();
            if (searchParams.origin) params.append('origen', searchParams.origin);
            if (searchParams.destination) params.append('destino', searchParams.destination);
            if (searchParams.departureDate) params.append('fechaSalida', searchParams.departureDate);
            if (searchParams.returnDate && searchParams.type === 'roundTrip') {
                params.append('fechaVuelta', searchParams.returnDate);
            }
            if (searchParams.type) params.append('tipo', searchParams.type);

            const url = `http://localhost/desarrollo_libre/back-end/routes.php?accion=buscarVuelos&${params.toString()}`;
            console.log('Buscando vuelos con URL:', url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Resultados de búsqueda:", data);
            
            if (data.success && data.data) {
                setEconomicFlights(data.data);
                setSearchFilters(data.filters || searchParams);
            } else {
                console.warn("No se encontraron vuelos con los filtros especificados");
                setEconomicFlights([]);
                setSearchFilters(searchParams);
            }
            
        } catch (err) {
            console.error("Error searching flights:", err);
            setError(err.message);
            setEconomicFlights([]);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const clearSearch = useCallback(() => {
        setSearchFilters(null);
        fetchEconomicFlights();
    }, [fetchEconomicFlights]);

    return (
        <HomeContext.Provider
            value={{ 
                economicFlights, 
                fetchEconomicFlights,
                searchFlights,
                clearSearch,
                loading, 
                error,
                searchFilters
            }}
        >
            {children}
        </HomeContext.Provider>
    );
};

export const useHome = () => useContext(HomeContext);