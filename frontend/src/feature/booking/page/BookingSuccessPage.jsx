import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../../../shared/components/Footer";
import Navbar from "../../../shared/components/Navbar";

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flightId, passengers, seats } = location.state || {};

  useEffect(() => {
    // Si no hay datos, redirigir al inicio
    if (!flightId || !passengers) {
      navigate('/');
    }
  }, [flightId, passengers, navigate]);

  if (!flightId || !passengers) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h3 className="mb-0 text-center">¡Reserva Confirmada!</h3>
              </div>
              <div className="card-body">
                <div className="text-center mb-4">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                </div>
                
                <h4 className="text-center mb-4">Su reserva ha sido procesada exitosamente</h4>
                
                <div className="row">
                  <div className="col-md-6">
                    <h5>Detalles de la Reserva</h5>
                    <p><strong>ID de Vuelo:</strong> {flightId}</p>
                    <p><strong>Número de Pasajeros:</strong> {passengers.length}</p>
                  </div>
                  
                  <div className="col-md-6">
                    <h5>Pasajeros</h5>
                    {passengers.map((passenger, index) => (
                      <div key={index} className="mb-2">
                        <p className="mb-1">
                          <strong>{passenger.firstName} {passenger.lastName}</strong>
                          {seats && seats[index] && (
                            <span className="text-muted"> - Asiento {seats[index]}</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <hr />
                
                <div className="alert alert-info">
                  <h6>Información Importante:</h6>
                  <ul className="mb-0">
                    <li>Recibirá un correo de confirmación en los próximos minutos</li>
                    <li>Presente su documento de identidad al momento del check-in</li>
                    <li>Llegue al aeropuerto con al menos 2 horas de anticipación</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate('/')}
                  >
                    Volver al Inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingSuccessPage;