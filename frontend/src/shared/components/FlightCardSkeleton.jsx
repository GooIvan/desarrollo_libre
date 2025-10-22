import React from 'react';

const skeletonStyles = `
  .skeleton-shimmer-container {
    position: relative;
    overflow: hidden;
    background-color: #f0f0f0;
    border-radius: 4px;
    animation: pulse 1.5s ease-in-out infinite alternate;
  }

  .skeleton-image {
    height: 200px;
    border-radius: 1rem;
  }

  .skeleton-title {
    height: 24px;
    width: 70%;
  }

  .skeleton-subtitle-long {
    height: 16px;
    width: 85%;
  }

  .skeleton-subtitle-short {
    height: 16px;
    width: 60%;
  }

  .skeleton-price {
    height: 20px;
    width: 50%;
  }

  .skeleton-button {
    height: 32px;
    width: 80px;
    border-radius: 8px;
  }

  .skeleton-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  @keyframes pulse {
    0% { background-color: #f0f0f0; }
    100% { background-color: #e0e0e0; }
  }

  .skeleton-shimmer-container:nth-child(2n) {
    animation-delay: 0.2s;
  }

  .skeleton-shimmer-container:nth-child(3n) {
    animation-delay: 0.4s;
  }

  .skeleton-shimmer-container:hover {
    background-color: #e8e8e8;
  }
`;

const FlightCardSkeleton = () => {
  return (
    <>
      {/* Inyectar estilos solo una vez */}
      <style>{skeletonStyles}</style>

      <div className="col-lg-3 col-md-4 col-sm-6">
        <div className="p-3 card h-100 shadow border rounded-4 overflow-hidden">
          {/* Imagen skeleton */}
          <div className="position-relative">
            <div className="skeleton-image skeleton-shimmer-container">
              <div className="skeleton-shimmer"></div>
            </div>
          </div>

          {/* Contenido skeleton */}
          <div className="card-body">
            {/* Título skeleton */}
            <div className="skeleton-title skeleton-shimmer-container mb-2">
              <div className="skeleton-shimmer"></div>
            </div>

            {/* Primera línea de texto skeleton */}
            <div className="skeleton-subtitle-long skeleton-shimmer-container mb-2">
              <div className="skeleton-shimmer"></div>
            </div>

            {/* Segunda línea de texto skeleton */}
            <div className="skeleton-subtitle-short skeleton-shimmer-container mb-3">
              <div className="skeleton-shimmer"></div>
            </div>

            <div className="d-flex flex-column gap-3">
              {/* Precio skeleton */}
              <div className="skeleton-price skeleton-shimmer-container">
                <div className="skeleton-shimmer"></div>
              </div>

              {/* Botón skeleton */}
              <div className="skeleton-button skeleton-shimmer-container">
                <div className="skeleton-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightCardSkeleton;
