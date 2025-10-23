import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./feature/home/page/HomePage";
import { HomeProvider } from "./feature/home/context/HomeContext";

import OffersPage from "./feature/offers/page/OffersPage"
import { OffersProvider } from "./feature/offers/context/OffersContext";
import LoginPage from "./feature/login/page/LoginPage"
import ProfilePage from "./feature/profile/page/ProfilePage";

import RegisterPage from "./feature/register/page/RegisterPage";
import { RegisterProvider } from "./feature/register/context/RegisterContext";

function App() {
  return (
    <Routes>
      {/* ruta inicio con su provider */}
      <Route path="/" element={
        <HomeProvider>
          <HomePage />
        </HomeProvider>
      } />

      {/* ruta ofertas con su provider*/}
      <Route path="/offers" element={
        <OffersProvider>
          <OffersPage />
        </OffersProvider>
      } />

      {/* ruta login */}
      <Route path="/login" element={<LoginPage />} />

      {/* ruta perfil */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* ruta registro con su provider */}
      <Route path="/register" element={
        <RegisterProvider>
          <RegisterPage />
        </RegisterProvider>
        } />

      {/* redirección para rutas no definidas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
