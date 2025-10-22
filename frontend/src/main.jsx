import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from "react-router-dom";
import App from './App.jsx'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from './shared/components/Navbar.jsx';

import './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Navbar />
      <App />
    </HashRouter>
  </StrictMode>,
)
