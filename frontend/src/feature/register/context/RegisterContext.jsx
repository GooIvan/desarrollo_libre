import { createContext, useState, useContext, useEffect } from "react";

const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);


  // Verificación de autenticación al cargar
    useEffect(() => {
        try {
            const storedAccount = localStorage.getItem("account");

            if (storedAccount !== "undefined" && storedAccount !== "null") {
                setAccount(JSON.parse(storedAccount));
            } else {
                setAccount(null);
            }
        } catch (error) {
            console.error("Error parsing account from localStorage:", error);
            setAccount(null);
            // Limpiar localStorage corrupto
            localStorage.removeItem("account");
        }

        setLoading(false);
    }, []);

    const register = async ({ email, password }) => {
        console.log("enviando registro a " + email, password);
        setLoading(true);

    try {
        const response = await fetch(`http://localhost/desarrollo_libre/back-end/routes.php?accion=crearAccount`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Email: email, Contrasena: password }),
        });

        const data = await response.json();
        console.log("Register response received:", data);

        if (data && data.success) {
            // Guardar datos del usuario
            const accountData = {
                email: email,
                id: data.IdAccount,
                createdAt: new Date().toISOString()
            };

            localStorage.setItem("account", JSON.stringify(accountData));
                
            setAccount(accountData);
            return true;
        } else {
            console.error("Registration failed:", data);
            return false;
        }
    } catch (error) {
        console.log("Error during registration:", error);
        alert("Error interno en el servidor.");
        return false;
        } finally {
        setLoading(false);
        console.log("Registration process completed.");
        }
    };

    return (
        <RegisterContext.Provider
        value={{
            account,
            setAccount,
            register,
            loading,
        }}
        >
        {children}
        </RegisterContext.Provider>
    );
};

export const useRegister = () => useContext(RegisterContext);