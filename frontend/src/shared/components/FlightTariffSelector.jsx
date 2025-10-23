import { useTranslation } from 'react-i18next';

const FlightTariffSelector = ({ onTariffSelect, prices }) => {
  const { t } = useTranslation();

  const handleTariffSelect = (tariff) => {
    if (onTariffSelect) {
      onTariffSelect(tariff, prices[tariff]);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('es-CO');
  };

  const tariffs = [
    {
      id: 'classic',
      name: t('tariff_classic'),
      recommended: true,
      color: '#e91e63',
      bgColor: '#fce4ec',
      price: prices.classic,
      features: [
        { text: t('tariff_personal_item'), included: true },
        { text: t('tariff_hand_luggage'), included: true },
        { text: t('tariff_checked_luggage'), included: true },
        { text: t('tariff_airport_checkin'), included: true },
        { text: t('tariff_economy_seat'), included: true },
        { text: t('tariff_lifemiles_6'), included: true },
        { text: t('tariff_onboard_menu'), included: false },
        { text: t('tariff_changes'), included: false },
        { text: t('tariff_refund'), included: false }
      ]
    },
    {
      id: 'vip',
      name: t('tariff_vip'),
      recommended: false,
      color: '#ff5722',
      bgColor: '#fff3e0',
      price: prices.vip,
      features: [
        { text: t('tariff_personal_item'), included: true },
        { text: t('tariff_hand_luggage'), included: true },
        { text: t('tariff_checked_luggage'), included: true },
        { text: t('tariff_airport_checkin'), included: true },
        { text: t('tariff_plus_seat'), included: true },
        { text: t('tariff_lifemiles_8'), included: true },
        { text: t('tariff_changes'), included: true },
        { text: t('tariff_refund_before'), included: true },
        { text: t('tariff_onboard_menu'), included: false }
      ]
    }
  ];

  return (
    <div className="p-4" style={{ minWidth: '800px' }}>
      <h2 className="text-center mb-4 fw-bold" style={{ color: '#2c3e50' }}>
        {t('choose_flight_type')}
      </h2>
      
      <div className="row justify-content-center gap-4">
        {tariffs.map((tariff) => (
          <div key={tariff.id} className="col-md-6 col-lg-5">
            <div 
              className={`card h-100 position-relative border-2`}
              style={{ 
                borderColor: '#e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: 'scale(1)'
              }}
              onClick={() => handleTariffSelect(tariff.id)}
            >
              {/* Badge recomendada */}
              {tariff.recommended && (
                <div 
                  className="position-absolute top-0 start-50 translate-middle px-3 py-1 rounded-pill text-white small fw-bold"
                  style={{ backgroundColor: tariff.color, zIndex: 10 }}
                >
                  {t('recommended')}
                </div>
              )}

              <div className="card-header border-0 text-center py-3" style={{ backgroundColor: tariff.bgColor }}>
                {/* Título con iconos */}
                <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                  <h3 className="fw-bold mb-0" style={{ color: tariff.color }}>
                    {tariff.name}
                  </h3>
                </div>
              </div>

              <div className="card-body px-4">
                {/* Lista de características */}
                <div className="mb-4">
                  {tariff.features.map((feature, index) => (
                    <div key={index} className="d-flex align-items-start gap-3 mb-2">
                      <span style={{ fontSize: '1.1rem' }}>{feature.icon}</span>
                      <div className="flex-grow-1">
                        <span 
                          className={`small ${feature.included ? 'text-dark' : 'text-muted'}`}
                          style={{ 
                            textDecoration: feature.included ? 'none' : 'line-through',
                            opacity: feature.included ? 1 : 0.6
                          }}
                        >
                          {feature.text}
                        </span>
                      </div>
                      <span className="small">
                        {feature.included ? (
                          <i className="bi bi-check-lg text-success"></i>
                        ) : (
                          <i className="bi bi-x-lg text-muted"></i>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer con precio */}
              <div className="card-footer border-0 p-4">
                <button 
                  className="btn w-100 text-white fw-bold py-3 rounded-3 mb-2"
                  style={{ 
                    backgroundColor: tariff.color,
                    border: `2px solid ${tariff.color}`,
                    fontSize: '1.1rem'
                  }}
                >
                  COP {tariff.price}
                </button>
                <p className="text-center mb-0 small text-muted">
                  {t('price_per_passenger')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <p className="text-muted small">
          {t('prices_subject_to_availability')}
        </p>
      </div>
    </div>
  );
};

export default FlightTariffSelector;