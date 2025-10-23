import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePassengers } from "../../passengers/context/PassengersContext";
import Footer from "../../../shared/components/Footer";
import Navbar from "../../../shared/components/Navbar";

const PaymentPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addMultiplePassengers, loading: savingPassengers } = usePassengers();
  
  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservationData();
  }, [flightId]);

  const loadReservationData = async () => {
    try {
      // Obtener datos guardados
      const savedPassengers = localStorage.getItem('tempPassengers');
      const savedSeats = localStorage.getItem('selectedSeats');
      
      if (savedPassengers) {
        setPassengers(JSON.parse(savedPassengers));
      }
      
      if (savedSeats) {
        setSelectedSeats(JSON.parse(savedSeats));
      }

      // Obtener información del vuelo
      const flightResponse = await fetch(`http://localhost/desarrollo_libre/back-end/routes.php?accion=obtenerVuelo&id=${flightId}`);
      const flightData = await flightResponse.json();
      
      if (flightData.success) {
        setFlight(flightData.vuelo);
      }
    } catch (error) {
      console.error('Error loading reservation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const validatePayment = () => {
    const errors = [];
    
    if (!paymentData.cardholderName.trim()) {
      errors.push('El nombre del titular es requerido');
    }
    
    if (!paymentData.cardNumber.replace(/\s/g, '') || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      errors.push('Número de tarjeta inválido');
    }
    
    if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
      errors.push('Fecha de expiración inválida');
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      errors.push('CVV inválido');
    }

    return errors;
  };

  const simulatePayment = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulación: 90% de éxito
        const success = Math.random() > 0.1;
        resolve(success);
      }, 2000);
    });
  };

  const handlePayment = async () => {
    const validationErrors = validatePayment();
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    setProcessing(true);

    try {
      // Simular procesamiento de pago
      const paymentResult = await simulatePayment();
      
      if (paymentResult) {
        setPaymentSuccess(true);
        
        // Preparar datos de pasajeros con vueloId
        const passengersWithFlight = passengers.map((passenger, index) => ({
          ...passenger,
          vueloId: parseInt(flightId),
          asiento: selectedSeats[index] || null
        }));

        // Guardar pasajeros en la base de datos
        const saveResult = await addMultiplePassengers(passengersWithFlight);
        
        if (saveResult) {
          // Limpiar datos temporales
          localStorage.removeItem('tempPassengers');
          localStorage.removeItem('selectedSeats');
          
          // Mostrar éxito y redirigir
          setTimeout(() => {
            navigate('/booking-success', { 
              state: { 
                flightId, 
                passengers: passengersWithFlight,
                seats: selectedSeats,
                flight: flight
              }
            });
          }, 2000);
        } else {
          throw new Error('Error al guardar los pasajeros');
        }
      } else {
        alert('El pago fue rechazado. Por favor, intente con otra tarjeta.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error al procesar el pago. Por favor, intente nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotal = () => {
    // Precio base por pasajero (esto debería venir del vuelo)
    const basePrice = 150000; // COP
    const premiumSurcharge = 25000; // Recargo por asiento premium
    
    let total = passengers.length * basePrice;
    
    // Agregar recargo por asientos premium (simulación)
    selectedSeats.forEach(seatNumber => {
      if (seatNumber && seatNumber.startsWith('1') || seatNumber.startsWith('2') || 
          seatNumber.startsWith('3') || seatNumber.startsWith('4') || seatNumber.startsWith('5')) {
        total += premiumSurcharge;
      }
    });
    
    return total;
  };

  if (loading) {
    return (
      <>
        <Navbar/>
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  if (paymentSuccess) {
    return (
      <>
        <Navbar/>
        <div className="container mt-5">
          <div className="text-center">
            <div className="alert alert-success">
              <h4>¡Pago Procesado Exitosamente!</h4>
              <p>Su reserva ha sido confirmada. Redirigiendo...</p>
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Procesando...</span>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <Navbar/>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Procesamiento de Pago</h2>
            
            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h5>Información de Pago</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label className="form-label">Nombre del Titular *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={paymentData.cardholderName}
                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                            placeholder="Nombre como aparece en la tarjeta"
                            disabled={processing}
                          />
                        </div>
                        
                        <div className="col-12 mb-3">
                          <label className="form-label">Número de Tarjeta *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={paymentData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            disabled={processing}
                          />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Fecha de Expiración *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={paymentData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                            placeholder="MM/AA"
                            maxLength="5"
                            disabled={processing}
                          />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                          <label className="form-label">CVV *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={paymentData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            maxLength="4"
                            disabled={processing}
                          />
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={processing || savingPassengers}
                      >
                        {processing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Procesando Pago...
                          </>
                        ) : (
                          `Pagar ${calculateTotal().toLocaleString('es-CO')} COP`
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h5>Resumen de Reserva</h5>
                  </div>
                  <div className="card-body">
                    {flight && (
                      <>
                        <h6>Vuelo</h6>
                        <p className="mb-2"><strong>{flight.origen} → {flight.destino}</strong></p>
                        <p className="mb-3 text-muted">{flight.fechaSalida} | {flight.horaSalida}</p>
                      </>
                    )}
                    
                    <h6>Pasajeros ({passengers.length})</h6>
                    {passengers.map((passenger, index) => (
                      <div key={index} className="mb-2">
                        <small>{passenger.firstName} {passenger.lastName}</small>
                        {selectedSeats[index] && (
                          <small className="text-muted"> - Asiento {selectedSeats[index]}</small>
                        )}
                      </div>
                    ))}
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between">
                      <span><strong>Total:</strong></span>
                      <span><strong>{calculateTotal().toLocaleString('es-CO')} COP</strong></span>
                    </div>
                  </div>
                </div>

                <div className="card mt-3">
                  <div className="card-body">
                    <h6 className="text-center">Pago Seguro</h6>
                    <p className="small text-muted text-center">
                      Sus datos están protegidos con encriptación SSL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default PaymentPage;
