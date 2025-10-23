import Footer from "../../../shared/components/Footer";
import Navbar from "../../../shared/components/Navbar";
import PassengerForm from "../../../shared/components/PassengerForm";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const PassengersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams(); // ID del vuelo

  const handleSubmit = (passengersData) => {
    console.log('Datos de pasajeros para selección de asientos:', passengersData);
    
    // Los datos ya están guardados temporalmente en localStorage por PassengerForm
    // Redirigir a la selección de asientos
    navigate(`/flights/${id}/seats`);
  };

  return (
    <>
      <Navbar/>
      <div className="container px-0 my-5">
        <h2 className="text-uppercase fw-bold mb-4 mt-3">{t('passengers')}</h2>

        <PassengerForm onSubmit={handleSubmit} loading={false} />
      </div>
      <Footer/>
    </>
  );
};

export default PassengersPage;
