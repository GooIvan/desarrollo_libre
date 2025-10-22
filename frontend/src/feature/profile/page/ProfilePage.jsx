import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../../../shared/components/Navbar';
import GifLoader from '../../../shared/components/GifLoader';

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccountData = async () => {
      setLoading(true);

      try {
        const storedAccount = localStorage.getItem("account");
        
        if (storedAccount && storedAccount !== "undefined" && storedAccount !== "null") {
          try {
            const accountData = JSON.parse(storedAccount);
            console.log("Account data loaded:", accountData);
            setAccount(accountData);
          } catch (parseError) {
            console.error("Error parsing account data:", parseError);
            // Limpiar datos corruptos
            localStorage.removeItem("account");
            localStorage.removeItem("token");
            setAccount(null);
          }
        } else {
          console.log("No account data found");
          setAccount(null);
        }
      } catch (error) {
        console.error("Error loading account data:", error);
        setAccount(null);
      } finally {
        setLoading(false);
      }
    };

    // Cargar datos inmediatamente
    loadAccountData();

    // Escuchar cambios en localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'account') {
        console.log("Account data changed, reloading...");
        loadAccountData();
      }
    };

    // Agregar listener para cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función para obtener la inicial del email
  const getInitial = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  // Función para generar color basado en el email
  const getAvatarColor = (email) => {
    if (!email) return '#6f42c1';
    
    const colors = [
      '#6f42c1', '#dc3545', '#28a745', '#007bff', 
      '#fd7e14', '#6610f2', '#e83e8c', '#20c997'
    ];
    
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('not_available', 'No disponible');
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return t('not_available', 'No disponible');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <GifLoader/>
      </div>
    );
  }

  if (!account) {
    return (
      <>
        <Navbar />
        <div 
          className="min-vh-100 d-flex align-items-center justify-content-center"
        >
          <div className="card shadow-sm border rounded-4 p-5 text-center" style={{ maxWidth: '450px' }}>
            <div className="mb-4">
              <div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold shadow-sm mb-3"
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#6f42c1',
                  fontSize: '2rem'
                }}
              >
                <i className="bi bi-person-circle"></i>
              </div>
            </div>
            <h3 className="mb-3" style={{ color: '#6f42c1' }}>{t('no_account_data', '¡Bienvenido!')}</h3>
            <p className="text-muted mb-4">
              {t('please_login', 'Para continuar, por favor inicia sesión o regístrate.')}
            </p>
            <div className="d-grid gap-3 mt-4">
              <Link 
                to="/login" 
                className="btn btn-lg text-white fw-semibold rounded-3"
                style={{ 
                  backgroundColor: '#6f42c1', 
                  borderColor: '#6f42c1',
                  padding: '12px'
                }}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                {t('login', 'Iniciar sesión')}
              </Link>
              <Link 
                to="/register" 
                className="btn btn-outline-lg rounded-3 fw-semibold"
                style={{ 
                  color: '#6f42c1',
                  borderColor: '#6f42c1',
                  padding: '12px'
                }}
              >
                <i className="bi bi-person-plus me-2"></i>
                {t('register', 'Registrarse')}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <Navbar />      
      {/* Hero Section con gradiente */}
      <div 
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #6f42c1 0%, #8B5CF6 100%)',
          minHeight: '200px'
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="text-center text-white">
                <h1 className="fw-bold mb-2">{t('my_profile', 'Mi Perfil')}</h1>
                <p className="lead opacity-90">{t('profile_description', 'Gestiona tu información personal')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-5">
                  
                  {/* Avatar y nombre */}
                  <div className="text-center mb-5">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold shadow-sm mb-3"
                      style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: getAvatarColor(account.email),
                        fontSize: '3rem'
                      }}
                    >
                      {getInitial(account.email)}
                    </div>
                    <h2 className="text-dark mb-2">{account.email}</h2>
                    <span className="badge bg-success rounded-pill px-3 py-2">
                      <i className="bi bi-check-circle me-1"></i>
                      {t('active_account', 'Cuenta Activa')}
                    </span>
                  </div>

                  {/* Información de la cuenta */}
                  <div className="row g-4">
                    
                    {/* Email */}
                    <div className="col-12">
                      <div className="p-4 bg-light rounded-3 border">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-envelope text-primary me-3" style={{ fontSize: '1.5rem' }}></i>
                          <h5 className="mb-0 text-dark">{t('email', 'Correo electrónico')}</h5>
                        </div>
                        <p className="mb-0 text-muted ps-5">{account.email}</p>
                      </div>
                    </div>

                    {/* ID de cuenta */}
                    <div className="col-md-6">
                      <div className="p-4 bg-light rounded-3 border">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-person-badge text-success me-3" style={{ fontSize: '1.5rem' }}></i>
                          <h6 className="mb-0 text-dark">{t('account_id', 'ID de Cuenta')}</h6>
                        </div>
                        <p className="mb-0 text-muted ps-5">#{account.id || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Fecha de registro */}
                    <div className="col-md-6">
                      <div className="p-4 bg-light rounded-3 border">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-calendar-plus text-info me-3" style={{ fontSize: '1.5rem' }}></i>
                          <h6 className="mb-0 text-dark">{t('registration_date', 'Fecha de Registro')}</h6>
                        </div>
                        <p className="mb-0 text-muted ps-5">{formatDate(account.createdAt)}</p>
                      </div>
                    </div>

                    {/* Estado de la cuenta */}
                    <div className="col-12">
                      <div className="p-4 bg-light rounded-3 border">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-shield-check text-warning me-3" style={{ fontSize: '1.5rem' }}></i>
                          <h6 className="mb-0 text-dark">{t('account_status', 'Estado de la Cuenta')}</h6>
                        </div>
                        <div className="ps-5">
                          <span className="badge bg-success me-2">
                            <i className="bi bi-check-circle me-1"></i>
                            {t('verified', 'Verificada')}
                          </span>
                          <span className="badge bg-primary me-2">
                            {t('active', 'Activa')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="row g-3 mt-4">
                    <div className="col-md-6">
                      <button 
                        className="btn btn-outline-primary btn-lg w-100 rounded-3"
                        onClick={() => alert(t('feature_coming_soon', 'Función próximamente'))}
                      >
                        {t('edit_profile', 'Editar Perfil')}
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        className="btn btn-outline-danger btn-lg w-100 rounded-3"
                        onClick={() => {
                          if (confirm(t('logout_confirm', '¿Estás seguro de cerrar sesión?'))) {
                            localStorage.removeItem('account');
                            localStorage.removeItem('token');
                            navigate('/login');
                          }
                        }}
                      >
                        {t('logout', 'Cerrar Sesión')}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
