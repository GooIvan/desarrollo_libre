import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import { useRegister } from '../context/RegisterContext'
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();
  const { register, loading } = useRegister();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert(t('passwords_dont_match', 'Las contraseñas no coinciden'));
      return;
    }

    try {
      const success = await register({ email, password });
      if (success) {
        // Mostrar mensaje de éxito y redirigir al perfil después de un breve delay
        alert(t('registration_successful', 'Registro exitoso'));
        setTimeout(() => {
          navigate('/profile');
        }, 100);
      } else {
        alert(t('registration_failed', 'Error en el registro'));
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert(t('registration_error', 'Error durante el registro'));
    }
  };

  return (
    <>
      <Navbar />
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-6">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-5">
                {/* Título */}
                <h2 className="text-center mb-4 fw-bold text-dark">
                  {t('register_title', 'Crear una cuenta')}
                </h2>
                
                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-muted">
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg border-1 rounded-3"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label text-muted">
                      {t('password')}
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg border-1 rounded-start-3"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                      <button
                        className="btn btn-outline-secondary rounded-end-3"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ backgroundColor: '#f8f9fa' }}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label text-muted">
                      {t('confirm_password')}
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control form-control-lg border-1 rounded-start-3"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                      <button
                        className="btn btn-outline-secondary rounded-end-3"
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ backgroundColor: '#f8f9fa' }}
                      >
                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Botón de registro */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 text-white fw-semibold rounded-3 mb-3"
                    style={{ 
                      backgroundColor: '#6f42c1', 
                      borderColor: '#6f42c1',
                      padding: '12px'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('creating_account', 'Creando cuenta...')}
                      </>
                    ) : (
                      t('create_account', 'Crear cuenta')
                    )}
                  </button>

                  <div className="text-center">
                    <span className="text-muted small me-2">
                      {t('already_have_account', '¿Ya tienes una cuenta?')}
                    </span>
                    <Link
                      to="/login"
                      className="text-decoration-none fw-semibold"
                      style={{ color: '#6f42c1' }}
                    >
                      {t('login', 'Iniciar sesión')}
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
      <script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>
    </div>
      <Footer />
    </>
  );
};

export default RegisterPage;