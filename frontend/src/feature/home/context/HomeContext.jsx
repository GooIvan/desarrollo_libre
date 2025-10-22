import { createContext, useCallback, useContext, useState } from "react";

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
    const [economicFlights, setEconomicFlights] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchEconomicFlights = useCallback(async () => {
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

            setEconomicFlights(data);
        } catch (err) {
            console.error("Error fetching economic flights:", err);
        } finally {
        setLoading(false);
    }
}, [loading]);

    return (
        <HomeContext.Provider
            value={{ economicFlights, fetchEconomicFlights, loading }}
        >
            {children}
        </HomeContext.Provider>
    );
};

export const useHome = () => useContext(HomeContext);