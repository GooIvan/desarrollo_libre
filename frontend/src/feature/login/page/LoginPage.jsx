
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import { useLogin } from "../context/LoginContext";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const { login, loading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await login({ email, password });
      if (success) {
        // Mostrar mensaje de éxito y redirigir al perfil después de un breve delay
        setTimeout(() => {
          navigate('/profile');
        }, 100);
      } else {
        alert(t('login_failed', 'Error en el inicio de sesión'));
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(t('login_error', 'Error durante el inicio de sesión'));
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
                  {t('login_title', 'Inicio de sesión')}
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

                  {/* Botón de login */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 text-white fw-semibold rounded-3 mb-3 d-flex justify-content-center align-items-center"
                    style={{
                      backgroundColor: '#6f42c1',
                      borderColor: '#6f42c1',
                      padding: '12px',
                      opacity: loading ? 0.8 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm text-light"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      t('login', 'Iniciar sesión')
                    )}
                  </button>

                  {/* Enlaces adicionales */}
                  {/*
                  <div className="text-center">
                    <a 
                      href="#" 
                      className="text-decoration-none text-muted small"
                      style={{ fontSize: '0.9rem' }}
                    >
                      {t('forgot_password', '¿Olvidaste tu contraseña?')}
                    </a>
                  </div>
                  <hr className="my-4" />
                  */}

                  <div className="text-center">
                    <span className="text-muted small me-2">
                      {t('no_account', '¿No tienes cuenta?')}
                    </span>
                    <Link
                      to="/register"
                      className="text-decoration-none fw-semibold"
                      style={{ color: '#6f42c1' }}
                    >
                      {t('register', 'Regístrate')}
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

export default LoginPage;