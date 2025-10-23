import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../../shared/components/Navbar';
import defaultCityImage from '../../../assets/images/city_empty.webp';
import { useFlight } from '../context/FlightContext';
import GifLoader from '../../../shared/components/GifLoader';
import Footer from '../../../shared/components/Footer';
import FlightTariffSelector from '../../../shared/components/FlightTariffSelector';

const FlightDetailsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { currentFlight, loading, getFlightById, initializeFlights, pendingFlightId } = useFlight();
  const [showTariffSelector, setShowTariffSelector] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    initializeFlights();
  }, []);

  useEffect(() => {
    if (id) {
      getFlightById(id);
    }
  }, [id]);

  const handleBookFlight = () => {
    setShowTariffSelector(true);
  };

  const handleTariffSelect = (tariffType, price) => {
    setSelectedTariff({ type: tariffType, price });
    setShowTariffSelector(false);
    //que navege a //flights/:id/passengers usando UseNavigate
    navigate(`/flights/${currentFlight.IdVuelo || currentFlight.idVuelo}/passengers`);
  };

  if (loading || pendingFlightId) {
    return (
      <>
        <Navbar />
        <GifLoader/>
        <Footer/>
      </>
    );
  }

  if (!currentFlight && !loading && !pendingFlightId) {
    return (
      <>
        <Navbar />
        <div className="container py-5 vh-100 d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <h2 className='fs-6'>{t('flight_not_found')}</h2>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div 
        className="position-relative"
        style={{
          height: '400px',
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${defaultCityImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className="display-4 fw-bold mb-3">{currentFlight.Destino}</h1>
          <p className="fs-5">{t('discover_destination')}</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Información del vuelo */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <h3 className="card-title mb-4" style={{ color: '#6f42c1' }}>
                  {t('flight_details')}
                </h3>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-geo-alt text-primary me-2"></i>
                      <strong>{t('origin')}:</strong>
                    </div>
                    <p className="ms-4 text-muted">{currentFlight.Origen}</p>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                      <strong>{t('destination')}:</strong>
                    </div>
                    <p className="ms-4 text-muted">{currentFlight.Destino}</p>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-calendar text-primary me-2"></i>
                      <strong>{t('departure_date')}:</strong>
                    </div>
                    <p className="ms-4 text-muted">{currentFlight.FechaSalida}</p>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-calendar-check text-primary me-2"></i>
                      <strong>{t('return_date')}:</strong>
                    </div>
                    <p className="ms-4 text-muted">{currentFlight.FechaVuelta}</p>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-airplane text-primary me-2"></i>
                      <strong>{t('aircraft')}:</strong>
                    </div>
                    <p className="ms-4 text-muted">{currentFlight.IdAvion}</p>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-hash text-primary me-2"></i>
                      <strong>{t('flight_id')}:</strong>
                    </div>
                    <p className="ms-4 text-muted">#{currentFlight.IdVuelo}</p>
                  </div>
                </div>
                
                {/* Horarios */}
                <div className="mt-4">
                  <h5 className="mb-3">{t('flight_schedule')}</h5>
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-3">
                    <div className="text-center">
                      <div className="fw-bold">{currentFlight.FechaSalida}</div>
                      <div className="text-muted small">{currentFlight.Origen}</div>
                      <div className="text-muted small">{currentFlight.FechaSalida}</div>
                    </div>
                    <div className="flex-grow-1 text-center">
                      <i className="bi bi-arrow-right text-primary fs-4"></i>
                      <div className="small text-muted">{t('outbound')}</div>
                    </div>
                    <div className="text-center">
                      <div className="fw-bold">--:--</div>
                      <div className="text-muted small">{currentFlight.Destino}</div>
                      <div className="text-muted small">{(currentFlight.FechaSalida)}</div>
                    </div>
                  </div>
                  
                  {currentFlight.FechaVuelta && (
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                      <div className="text-center">
                        <div className="fw-bold">{(currentFlight.FechaVuelta)}</div>
                        <div className="text-muted small">{currentFlight.Destino}</div>
                        <div className="text-muted small">{(currentFlight.FechaVuelta)}</div>
                      </div>
                      <div className="flex-grow-1 text-center">
                        <i className="bi bi-arrow-left text-primary fs-4"></i>
                        <div className="small text-muted">{t('return_trip')}</div>
                      </div>
                      <div className="text-center">
                        <div className="fw-bold">--:--</div>
                        <div className="text-muted small">{currentFlight.Origen}</div>
                        <div className="text-muted small">{(currentFlight.FechaVuelta)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Panel de reserva */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 position-sticky" style={{ top: '20px' }}>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h4 className="fw-bold" style={{ color: '#6f42c1' }}>
                    ${(currentFlight.PrecioIda)}
                  </h4>
                  <p className="text-muted mb-0">{t('per_person_outbound')}</p>
                  {currentFlight.PrecioVuelta && (
                    <>
                      <h5 className="fw-bold mt-2" style={{ color: '#6f42c1' }}>
                        ${(currentFlight.PrecioVuelta)}
                      </h5>
                      <p className="text-muted mb-0">{t('return_label')}</p>
                    </>
                  )}
                </div>
                
                <button 
                  className="btn w-100 text-white fw-semibold py-3 rounded-3"
                  style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
                  onClick={handleBookFlight}
                >
                  {t('book_now')}
                </button>
                
                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex justify-content-between mb-2">
                    <span>{t('price_outbound')}:</span>
                    <span>${(currentFlight.PrecioIda)}</span>
                  </div>
                  {currentFlight.PrecioVuelta && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>{t('price_return')}:</span>
                      <span>${(currentFlight.PrecioVuelta)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span>{t('taxes_fees')}:</span>
                    <span>${((currentFlight.PrecioIda + (currentFlight.PrecioVuelta || 0)) * 0.15)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>{t('total')}:</span>
                    <span>${(currentFlight.PrecioIda + (currentFlight.PrecioVuelta || 0) + ((currentFlight.PrecioIda + (currentFlight.PrecioVuelta || 0)) * 0.15))}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="d-flex align-items-center text-success mb-2">
                    <i className="bi bi-check-circle me-2"></i>
                    <small>{t('free_cancellation')}</small>
                  </div>
                  <div className="d-flex align-items-center text-success mb-2">
                    <i className="bi bi-check-circle me-2"></i>
                    <small>{t('no_change_fees')}</small>
                  </div>
                  <div className="d-flex align-items-center text-success">
                    <i className="bi bi-check-circle me-2"></i>
                    <small>{t('baggage_included')}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Tarifas - Modal/Sección */}
      {showTariffSelector && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="bg-white rounded-4 p-0 position-relative" style={{ maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' }}>
            {/* Botón cerrar */}
            <button 
              className="btn btn-link position-absolute top-0 end-0 m-3 text-dark fs-4"
              onClick={() => setShowTariffSelector(false)}
              style={{ zIndex: 10000 }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            
            <FlightTariffSelector 
              onTariffSelect={handleTariffSelect}
              prices={{
                classic: currentFlight.PrecioIda,
                vip: currentFlight.PrecioIda * 1.2
              }}
            />
          </div>
        </div>
      )}
      
      <Footer/>
    </>
  );
};

export default FlightDetailsPage;