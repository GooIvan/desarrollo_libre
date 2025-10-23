import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../../../shared/components/Footer";
import Navbar from "../../../shared/components/Navbar";
import QRCodeDisplay from "../../../shared/components/QRCodeDisplay";
import { useBookingPDF } from "../../../shared/hooks/useBookingPDF";

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flightId, passengers, seats, flight } = location.state || {};
  const { downloadBookingPDF } = useBookingPDF();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [bookingCode, setBookingCode] = useState(null);

  useEffect(() => {
    // Si no hay datos, redirigir al inicio
    if (!flightId || !passengers) {
      navigate('/');
    }
  }, [flightId, passengers, navigate]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const bookingData = {
        flightId,
        passengers,
        seats,
        flight
      };
      
      const generatedCode = await downloadBookingPDF(bookingData);
      if (generatedCode) {
        setBookingCode(generatedCode);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
                
                {bookingCode && (
                  <div className="alert alert-info text-center">
                    <h6>Código de Reserva Generado</h6>
                    <p className="mb-0"><strong>{bookingCode}</strong></p>
                  </div>
                )}

                <QRCodeDisplay 
                  bookingData={{ flightId, passengers, seats, flight }}
                  bookingCode={bookingCode}
                />

                <div className="alert alert-info">
                  <h6>Información Importante:</h6>
                  <ul className="mb-0">
                    <li>Recibirá un correo de confirmación en los próximos minutos</li>
                    <li>Presente su documento de identidad al momento del check-in</li>
                    <li>Llegue al aeropuerto con al menos 2 horas de anticipación</li>
                    <li>Descargue su comprobante en PDF para llevarlo impreso</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <button 
                        className="btn btn-success btn-lg w-100"
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                      >
                        {isGeneratingPDF ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Generando PDF...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-download me-2"></i>
                            Descargar PDF con QR
                          </>
                        )}
                      </button>
                    </div>
                    <div className="col-md-6 mb-2">
                      <button 
                        className="btn btn-primary btn-lg w-100"
                        onClick={() => navigate('/')}
                      >
                        <i className="bi bi-house me-2"></i>
                        Volver al Inicio
                      </button>
                    </div>
                  </div>
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