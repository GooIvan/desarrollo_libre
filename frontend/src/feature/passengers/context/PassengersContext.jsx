import { createContext, useState, useContext, useEffect } from "react";

const PassengersContext = createContext();

export const PassengersProvider = ({ children }) => {
    const [Passengers, setPassengers] = useState(null);
    const [loading, setLoading] = useState(false);

    // Inicializar el contexto
    useEffect(() => {
        setLoading(false);
    }, []);

    const addPassenger = async ({ gender, name, lastname, birthDay, birthMonth, birthYear, nationality, phone, document, documentType, esPagante = false, vueloId = null }, manageLoading = true) => {
        if (manageLoading) setLoading(true);

        try {
            const response = await fetch(`http://localhost/desarrollo_libre/back-end/routes.php?accion=crearPasajero`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    gender, 
                    name, 
                    lastname, 
                    birthDay, 
                    birthMonth, 
                    birthYear, 
                    nationality,
                    phone,
                    document,
                    documentType,
                    esPagante,
                    vueloId
                }),
            });

            const data = await response.json();
            console.log("Add passenger response received:", data);

            if (data && data.success) {
                const passengerData = {
                    gender: gender,
                    name: name,
                    lastname: lastname,
                    birthDay: birthDay,
                    birthMonth: birthMonth,
                    birthYear: birthYear,
                    nationality: nationality,
                    phone: phone,
                    document: document,
                    documentType: documentType,
                    esPagante: esPagante,
                    vueloId: vueloId,
                    createdAt: new Date().toISOString()
                };

                setPassengers(passengerData);
                return true;
            } else {
                console.error("Passenger registration failed:", data);
                return false;
            }
        } catch (error) {
            console.log("Error during registration:", error);
            return false;
        } finally {
            if (manageLoading) {
                setLoading(false);
                console.log("Passenger process completed.");
            }
        }
    };

    const addMultiplePassengers = async (passengersArray) => {
        setLoading(true);
        
        try {
            const results = [];
            
            for (const passenger of passengersArray) {
                // Pasar manageLoading = false para evitar conflictos de loading
                const success = await addPassenger({
                    gender: passenger.Genero,
                    name: passenger.firstName,
                    lastname: passenger.lastName,
                    birthDay: passenger.birthDay,
                    birthMonth: passenger.birthMonth,
                    birthYear: passenger.birthYear,
                    nationality: passenger.nationality,
                    phone: passenger.Telefono,
                    document: passenger.DocumentoIdentidad,
                    documentType: passenger.TipoDocumento,
                    esPagante: passenger.esPagante || false,
                    vueloId: passenger.vueloId || null
                }, false);
                
                results.push(success);
                
                if (!success) {
                    console.error("Failed to add passenger:", passenger);
                    return false;
                }
            }
            
            return results.every(result => result === true);
        } catch (error) {
            console.error("Error adding multiple passengers:", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <PassengersContext.Provider
        value={{
            Passengers,
            setPassengers,
            addPassenger,
            addMultiplePassengers,
            loading,
        }}
        >
        {children}
        </PassengersContext.Provider>
    );
};

export const usePassengers = () => useContext(PassengersContext);