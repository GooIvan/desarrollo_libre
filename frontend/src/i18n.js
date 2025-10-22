import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      "offers": "Ofertas",
      "reservations": "Mis Reservas",
      "search": "Buscar",
      "from": "Desde",
      "takesoff": "Despega",
      "view_more": "Ver más",

      "roundtrip": "Ida y Vuelta",
      "oneway": "Solo Ida",

      "select_destination": "Selecciona Destino",
      "origin": "Origen",
      "destination": "Destino",
      "departure": "Ida",
      "return": "Vuelta",
      "passengers": "Pasajeros",
      "passenger": "Pasajero",
      "home_title": "Busca tu destino ideal",
      "home_subtitle": "Ofertas de viajes más económicas",

      // Login translations
      "login_title": "Inicio de sesión",
      "login_button": "Ingresar",
      "forgot_password": "¿Olvidaste tu contraseña?",
      "no_account": "¿No tienes cuenta?",
      "register": "Regístrate",
      "email": "Correo electrónico",
      "password": "Contraseña",

      // Register translations
      "register_title": "Crear una cuenta",
      "register_button": "Registrarse",
      "confirm_password": "Confirmar contraseña",
      "already_have_account": "¿Ya tienes una cuenta?",
      "login": "Iniciar sesión",
      "create_account": "Crear cuenta",
      "passwords_dont_match": "Las contraseñas no coinciden",
      "registration_successful": "Registro exitoso",
      "registration_failed": "Error en el registro",
      "registration_error": "Error durante el registro",
      "creating_account": "Creando cuenta...",

      // Profile translations
      "my_profile": "Mi Perfil",
      "profile_description": "Gestiona tu información personal",
      "no_account_data": "No hay datos de cuenta",
      "please_login": "Por favor inicia sesión",
      "active_account": "Cuenta Activa",
      "account_id": "ID de Cuenta",
      "registration_date": "Fecha de Registro",
      "account_status": "Estado de la Cuenta",
      "verified": "Verificada",
      "active": "Activa",
      "edit_profile": "Editar Perfil",
      "logout": "Cerrar Sesión",
      "logout_confirm": "¿Estás seguro de cerrar sesión?",
      "feature_coming_soon": "Función próximamente",
      "not_available": "No disponible",
      "loading_profile": "Cargando perfil...",
    }
  },
  en: {
    translation: {
      "offers": "Offers",
      "reservations": "My Reservations",
      "search": "Search",
      "from": "From",
      "takesoff": "Takes Off",
      "view_more": "View More",

      "roundtrip": "Round Trip",
      "oneway": "One Way",

      "origin": "Origin",
      "select_destination": "Select Destination",
      "destination": "Destination",
      "departure": "Departure",
      "return": "Return",
      "passengers": "Passengers",
      "passenger": "Passenger",
      "home_title": "Find your ideal destination",
      "home_subtitle": "Most affordable travel deals",

      // Login translations
      "login_title": "Sign In",
      "login_button": "Login",
      "forgot_password": "Forgot your password?",
      "no_account": "Don't have an account?",
      "register": "Sign Up",
      "email": "Email",
      "password": "Password",

      // Register translations
      "register_title": "Create an Account",
      "register_button": "Register",
      "confirm_password": "Confirm Password",
      "already_have_account": "Already have an account?",
      "login": "Sign In",
      "create_account": "Create Account",
      "passwords_dont_match": "Passwords don't match",
      "registration_successful": "Registration successful",
      "registration_failed": "Registration failed",
      "registration_error": "Error during registration",
      "creating_account": "Creating account...",

      // Profile translations
      "my_profile": "My Profile",
      "profile_description": "Manage your personal information",
      "no_account_data": "No account data available",
      "please_login": "Please log in",
      "active_account": "Active Account",
      "account_id": "Account ID",
      "registration_date": "Registration Date",
      "account_status": "Account Status",
      "verified": "Verified",
      "active": "Active",
      "edit_profile": "Edit Profile",
      "logout": "Log Out",
      "logout_confirm": "Are you sure you want to log out?",
      "feature_coming_soon": "Feature coming soon",
      "not_available": "Not available",
      "loading_profile": "Loading profile...",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    lng: 'es',
    fallbackLng: 'en',
    debug: true,
    
    resources,
    
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;