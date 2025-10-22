import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      "offers": "Ofertas",
      "reservations": "Mis Reservas",
      "search": "Buscar",

      "roundtrip": "Ida y Vuelta",
      "oneway": "Solo Ida",

      "select_destination": "Selecciona Destino",
      "origin": "Origen",
      "destination": "Destino",
      "departure": "Ida",
      "return": "Vuelta",
      "passengers": "Pasajeros",
      "passenger": "Pasajero",
    }
  },
  en: {
    translation: {
      "offers": "Offers",
      "reservations": "My Reservations",
      "search": "Search",

      "roundtrip": "Round Trip",
      "oneway": "One Way",

      "origin": "Origin",
      "select_destination": "Select Destination",
      "destination": "Destination",
      "departure": "Departure",
      "return": "Return",
      "passengers": "Passengers",
      "passenger": "Passenger",
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