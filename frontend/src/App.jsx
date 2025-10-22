import { Routes, Route, Navigate } from "react-router-dom";

//Pages
import HomePage from "./feature/home/page/HomePage";
import OffersPage from "./feature/offers/page/OffersPage"
import LoginPage from "./feature/login/page/LoginPage"


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/offers" element={<OffersPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
