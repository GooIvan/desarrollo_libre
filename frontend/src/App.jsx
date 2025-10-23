import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./feature/home/page/HomePage";
import { HomeProvider } from "./feature/home/context/HomeContext";

import OffersPage from "./feature/offers/page/OffersPage"
import { OffersProvider } from "./feature/offers/context/OffersContext";
import LoginPage from "./feature/login/page/LoginPage"
import { LoginProvider } from "./feature/login/context/LoginContext";
import ProfilePage from "./feature/profile/page/ProfilePage";

import PaymentPage from "./feature/payment/page/PaymentPage";
import SeatSelectionPage from "./feature/seats/page/SeatSelectionPage";
import BookingSuccessPage from "./feature/booking/page/BookingSuccessPage";

import RegisterPage from "./feature/register/page/RegisterPage";
import { RegisterProvider } from "./feature/register/context/RegisterContext";
import FlightDetailsPage from "./feature/flights/page/FlightDetailsPage";
import { FlightProvider } from "./feature/flights/context/FlightContext";
import PassengersPage from "./feature/passengers/page/PassengersPage";
import { PassengersProvider } from "./feature/passengers/context/PassengersContext";

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
      <Route path="/login" element={
        <LoginProvider>
          <LoginPage />
        </LoginProvider>
      } />

      {/* ruta perfil */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* ruta registro con su provider */}
      <Route path="/register" element={
        <RegisterProvider>
          <RegisterPage />
        </RegisterProvider>
        } />

      {/* ruta show vuelo */}
      <Route path="/flights/:id" element={
        <FlightProvider>
          <FlightDetailsPage />
        </FlightProvider>
      } />

      {/* Ruta para pasajeros */}
      <Route path="/flights/:id/passengers" element={
        <PassengersProvider>
          <PassengersPage />
        </PassengersProvider>
      } />

      {/* Ruta para selección de asientos */}
      <Route path="/flights/:flightId/seats" element={
        <SeatSelectionPage />
      } />

      {/* Ruta para pago */}
      <Route path="/flights/:flightId/payment" element={
        <PassengersProvider>
          <PaymentPage />
        </PassengersProvider>
      } />

      {/* Ruta para éxito de reserva */}
      <Route path="/booking-success" element={<BookingSuccessPage />} />

      {/* redirección para rutas no definidas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
