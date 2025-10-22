import { createContext, useCallback, useContext, useState } from "react";

const OffersContext = createContext();

export const OffersProvider = ({ children }) => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFlights = useCallback(async () => {
        if (loading) return;
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            const url = `https://mocki.io/v1/81049dd1-7cb8-4005-bb71-de3214929108`;

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            const data = await res.json();

            setFlights(data);
        } catch (err) {
            console.error("Error fetching flights:", err);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    return (
        <OffersContext.Provider
            value={{ flights, fetchFlights, loading }}
        >
            {children}
        </OffersContext.Provider>
    );
};

export const useOffers = () => useContext(OffersContext);
