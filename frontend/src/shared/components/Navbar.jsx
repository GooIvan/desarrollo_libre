import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('es');
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      console.log('Nuevo idioma:', i18n.language);
      setCurrentLang(lng); // Forzar re-render
    }).catch(err => {
      console.error('Error al cambiar idioma:', err);
    });
    
    setLangDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownOpen && !event.target.closest('.dropdown')) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownOpen]);

  // Sincronizar el estado local con i18n
  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLang(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow" style={{backgroundColor: '#6f42c1'}}>
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="p-2">
            <i className="bi bi-airplane-fill text-white"></i>
          </span>
          <span className="fw-bold fs-4">PRAGMA</span>
        </Link>

        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
          onClick={() => setNavOpen(!navOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu principal */}
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link text-uppercase fw-semibold px-4" to="/offers">
                {t('offers' )}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-uppercase fw-semibold px-4" to="/myreservation">
                {t('reservations')}
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {/* Selector de idioma */}
            <div className="dropdown me-2">
              <button
                className="btn text-white btn-sm"
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              >
                <i className="bi bi-globe me-1"></i>
                {i18n.language?.startsWith('es') ? 'ES' : 'EN'}
              </button>
              
              {langDropdownOpen && (
                <div className="dropdown-menu dropdown-menu-end show position-absolute" style={{right: 0, top: '100%', minWidth: '120px'}}>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => changeLanguage('es')}
                  >
                    🇪🇸 ES
                    {i18n.language?.startsWith('es') && <span className="ms-auto">✓</span>}
                  </button>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => changeLanguage('en')}
                  >
                    🇺🇸 EN
                    {i18n.language?.startsWith('en') && <span className="ms-auto">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Perfil de usuario */}
            <Link to="/login" className="btn text-white btn-sm">
              <i className="bi bi-person"></i>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;