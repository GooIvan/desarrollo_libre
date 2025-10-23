import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../../shared/components/Footer";
import Navbar from "../../../shared/components/Navbar";

const SeatSelectionPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [flight, setFlight] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener datos de pasajeros desde localStorage o contexto
    const savedPassengers = localStorage.getItem('tempPassengers');
    if (savedPassengers) {
      setPassengers(JSON.parse(savedPassengers));
    }
    
    loadFlightAndSeats();
  }, [flightId]);

  const loadFlightAndSeats = async () => {
    try {
      setLoading(true);
      
      // Obtener información del vuelo
      const flightResponse = await fetch(`http://localhost/desarrollo_libre/back-end/routes.php?accion=obtenerVuelo&id=${flightId}`);
      const flightData = await flightResponse.json();
      
      if (flightData.success) {
        setFlight(flightData.vuelo);
      }

      // Generar asientos simulados (esto debería venir de la base de datos)
      const totalSeats = 180; // Avión típico
      const occupiedSeats = [1, 3, 7, 12, 15, 18, 22, 25, 30]; // Asientos ocupados simulados
      
      const seatLayout = [];
      for (let row = 1; row <= 30; row++) {
        for (let letter of ['A', 'B', 'C', 'D', 'E', 'F']) {
          const seatNumber = `${row}${letter}`;
          const seatId = ((row - 1) * 6) + ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(letter) + 1;
          
          seatLayout.push({
            id: seatId,
            number: seatNumber,
            row: row,
            letter: letter,
            isOccupied: occupiedSeats.includes(seatId),
            isSelected: false,
            type: row <= 5 ? 'premium' : 'economy'
          });
        }
      }
      
      setSeats(seatLayout);
    } catch (error) {
      console.error('Error loading flight and seats:', error);
      setError('Error al cargar la información del vuelo');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    
    if (seat.isOccupied) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        // Deseleccionar asiento
        return prev.filter(id => id !== seatId);
      } else {
        // Seleccionar asiento solo si no excede el número de pasajeros
        if (prev.length < passengers.length) {
          return [...prev, seatId];
        }
        return prev;
      }
    });
  };

  const getSeatClass = (seat) => {
    let classes = 'seat';
    
    if (seat.isOccupied) {
      classes += ' seat-occupied';
    } else if (selectedSeats.includes(seat.id)) {
      classes += ' seat-selected';
    } else {
      classes += seat.type === 'premium' ? ' seat-premium' : ' seat-economy';
    }
    
    return classes;
  };

  const handleContinueToPayment = () => {
    if (selectedSeats.length !== passengers.length) {
      alert(`Debe seleccionar exactamente ${passengers.length} asientos`);
      return;
    }

    // Guardar asientos seleccionados
    const selectedSeatNumbers = selectedSeats.map(seatId => {
      const seat = seats.find(s => s.id === seatId);
      return seat.number;
    });

    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeatNumbers));
    
    // Redirigir a la página de pago
    navigate(`/flights/${flightId}/payment`);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Selección de Asientos</h2>

          <div className="row">
            <div className="col-md-8">
              <div className="seat-map">
                <div className="airplane-layout">
                  <div className="airplane-nose">
                    <h6 className="text-center mb-3">Frente del Avión</h6>
                  </div>
                  
                  {/* Leyenda */}
                  <div className="seat-legend mb-3">
                    <div className="d-flex justify-content-center gap-3">
                      <div><span className="seat seat-economy me-2"></span> Disponible</div>
                      <div><span className="seat seat-occupied me-2"></span> Ocupado</div>
                      <div><span className="seat seat-selected me-2"></span> Seleccionado</div>
                      <div><span className="seat seat-premium me-2"></span> Premium</div>
                    </div>
                  </div>

                  {/* Mapa de asientos */}
                  <div className="seats-container">
                    {Array.from({ length: 30 }, (_, rowIndex) => {
                      const row = rowIndex + 1;
                      const rowSeats = seats.filter(seat => seat.row === row);
                      
                      return (
                        <div key={row} className="seat-row d-flex justify-content-center align-items-center mb-2">
                          <div className="row-number me-2">{row}</div>
                          
                          {/* Asientos del lado izquierdo (A, B, C) */}
                          <div className="d-flex">
                            {rowSeats.filter(seat => ['A', 'B', 'C'].includes(seat.letter)).map(seat => (
                              <button
                                key={seat.id}
                                className={getSeatClass(seat)}
                                onClick={() => handleSeatSelect(seat.id)}
                                disabled={seat.isOccupied}
                                title={`Asiento ${seat.number}`}
                              >
                                {seat.letter}
                              </button>
                            ))}
                          </div>
                          
                          {/* Pasillo */}
                          <div className="aisle mx-2"></div>
                          
                          {/* Asientos del lado derecho (D, E, F) */}
                          <div className="d-flex">
                            {rowSeats.filter(seat => ['D', 'E', 'F'].includes(seat.letter)).map(seat => (
                              <button
                                key={seat.id}
                                className={getSeatClass(seat)}
                                onClick={() => handleSeatSelect(seat.id)}
                                disabled={seat.isOccupied}
                                title={`Asiento ${seat.number}`}
                              >
                                {seat.letter}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Resumen de Selección</h5>
                </div>
                <div className="card-body">
                  <p><strong>Pasajeros:</strong> {passengers.length}</p>
                  <p><strong>Asientos seleccionados:</strong> {selectedSeats.length}/{passengers.length}</p>
                  
                  {selectedSeats.length > 0 && (
                    <div>
                      <h6>Asientos:</h6>
                      <ul className="list-unstyled">
                        {selectedSeats.map(seatId => {
                          const seat = seats.find(s => s.id === seatId);
                          return (
                            <li key={seatId} className="mb-1">
                              {seat.number} ({seat.type === 'premium' ? 'Premium' : 'Económico'})
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleContinueToPayment}
                      disabled={selectedSeats.length !== passengers.length}
                    >
                      Continuar al Pago
                    </button>
                  </div>
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

// CSS estilos para los asientos
const seatStyles = `
  .seat-map {
    max-width: 600px;
    margin: 0 auto;
  }

  .seat {
    width: 35px;
    height: 35px;
    margin: 2px;
    border: 2px solid;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: all 0.2s ease;
  }

  .seat:hover:not(:disabled) {
    transform: scale(1.1);
  }

  .seat-economy {
    border-color: #28a745;
    color: #28a745;
  }

  .seat-economy:hover:not(:disabled) {
    background-color: #28a745;
    color: white;
  }

  .seat-premium {
    border-color: #ffc107;
    color: #ffc107;
    background-color: #fff3cd;
  }

  .seat-premium:hover:not(:disabled) {
    background-color: #ffc107;
    color: white;
  }

  .seat-occupied {
    border-color: #dc3545;
    background-color: #dc3545;
    color: white;
    cursor: not-allowed;
  }

  .seat-selected {
    border-color: #007bff;
    background-color: #007bff;
    color: white;
  }

  .aisle {
    width: 20px;
  }

  .row-number {
    width: 30px;
    font-size: 12px;
    font-weight: bold;
    text-align: right;
  }

  .airplane-nose {
    background: linear-gradient(to bottom, #e9ecef 0%, #dee2e6 100%);
    border-radius: 50px 50px 0 0;
    padding: 15px;
    margin-bottom: 20px;
  }

  .seat-legend span.seat {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
  }
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = seatStyles;
  document.head.appendChild(styleSheet);
}

export default SeatSelectionPage;