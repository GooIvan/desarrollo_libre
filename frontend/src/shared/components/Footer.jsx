const Footer = () => {
  return (
    <footer className="text-white py-4 mt-5" style={{ backgroundColor: "#6f42c1" }}>
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
        {/* Logo o nombre */}
        <div className="mb-3 mb-md-0">
          <h5 className="mb-1">Desarrollo Libre</h5>
          <small>Senasoft | 2025</small>
        </div>

        {/* Enlaces */}
        <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3 mb-3 mb-md-0">
          {/* <li><a href="#" className="text-white text-decoration-none">Inicio</a></li> */}
        </ul>

        {/* Derechos */}
        <div>
          <small>&copy; {new Date().getFullYear()} Desarrollo Libre. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
