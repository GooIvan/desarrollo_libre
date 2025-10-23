import loaderGif from "../../assets/images/plane-loader.gif";

const GifLoader = ({ text = "Cargando..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '88vh' }}>
      <div className="text-center">
        <img
          src={loaderGif}
          alt="Cargando..."
          style={{
            width: "150px",
            filter: 'hue-rotate(240deg) saturate(1.2) brightness(1.1)',
            marginBottom: '20px',
          }}
        />
        <h4 className="text-dark fw-light opacity-90 fs-6">
          {text}
        </h4>
      </div>
    </div>
  );
};

export default GifLoader;
