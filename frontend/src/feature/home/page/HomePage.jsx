import { useState } from "react";
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const [selected, setSelected] = useState("roundTrip");
  const { t } = useTranslation();

  return (
    <>
      <div className="container px-0 my-5">
        <div className="shadow-sm p-4 border rounded-5 w-100">
          {/* Opciones de vuelo */}
          <div className="p-2 rounded-5 border d-inline-block shadow-sm mb-4">
            <div className="form-check form-check-inline custom-checkbox">
              <input
                className="form-check-input"
                type="checkbox"
                id="roundTrip"
                checked={selected === "roundTrip"}
                onChange={() => setSelected("roundTrip")}
              />
              <label className="form-check-label" htmlFor="roundTrip">
                {t('roundtrip')}
              </label>
            </div>

            <div className="form-check form-check-inline custom-checkbox">
              <input
                className="form-check-input"
                type="checkbox"
                id="oneWay"
                checked={selected === "oneWay"}
                onChange={() => setSelected("oneWay")}
              />
              <label className="form-check-label" htmlFor="oneWay">
                {t('oneway')}
              </label>
            </div>
          </div>

          {/* Formulario de búsqueda */}
          <div className="row g-3 align-items-end">
            {/* Origen */}
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label text-muted small">
                  <i className="bi bi-airplane-engines me-1"></i>
                  {t('origin')}
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-lg border-0 bg-light"
                    placeholder="Bogotá (BOG)"
                    defaultValue="Bogotá (BOG)"
                  />
                </div>
              </div>
            </div>

            {/* Destino */}
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label text-muted small">
                  <i className="bi bi-geo-alt me-1"></i>
                  {t('destination')}
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-lg border-0 bg-light"
                    placeholder={t('select_destination')}
                  />
                </div>
              </div>
            </div>

            {/* Fecha de ida */}
            <div className="col-md-2">
              <div className="form-group">
                <label className="form-label text-muted small">
                  <i className="bi bi-calendar3 me-1"></i>
                  {t('departure')}
                </label>
                <div className="input-group">
                  <input
                    type="date"
                    className="form-control form-control-lg border-0 bg-light"
                    defaultValue="2025-10-24"
                  />
                </div>
              </div>
            </div>

            {/* Fecha de vuelta (solo si es ida y vuelta) */}
            {selected === "roundTrip" && (
              <div className="col-md-2">
                <div className="form-group">
                  <label className="form-label text-muted small">
                    <i className="bi bi-calendar3 me-1"></i>
                    {t('return')}
                  </label>
                  <div className="input-group">
                    <input
                      type="date"
                      className="form-control form-control-lg border-0 bg-light"
                      defaultValue="2025-10-31"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pasajeros */}
            <div className="col-md-2">
              <div className="form-group">
                <label className="form-label text-muted small">
                  <i className="bi bi-people me-1"></i>
                  {t('passengers')}
                </label>
                <div className="input-group">
                  <select className="form-select form-select-lg border-0 bg-light">
                    <option value="1">1 {t('passenger')}</option>
                    <option value="2">2 {t('passengers')}</option>
                    <option value="3">3 {t('passengers')}</option>
                    <option value="4">4 {t('passengers')}</option>
                    <option value="5">5+ {t('passengers')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botón de búsqueda */}
            <div className="col-md-2">
              <button 
                className="btn btn-dark btn-lg w-100 rounded-4"
                style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
              >
                {t('search')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
      <script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>
    </>
  );
};

export default HomePage;