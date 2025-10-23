import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QRCodeDisplay = ({ bookingData, bookingCode }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        setLoading(true);
        const qrData = JSON.stringify({
          bookingCode: bookingCode,
          flightId: bookingData.flightId,
          passengers: bookingData.passengers?.length || 0,
          date: new Date().toISOString()
        });
        
        const qrCodeURL = await QRCode.toDataURL(qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#6642c1',
            light: '#FFFFFF'
          }
        });
        
        setQrCodeDataURL(qrCodeURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingCode && bookingData) {
      generateQR();
    }
  }, [bookingCode, bookingData]);

  if (!bookingCode) {
    return null;
  }

  return (
    <div className="text-center mt-4">
      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">Código QR de Verificación</h6>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Generando QR...</span>
            </div>
          ) : (
            <>
              {qrCodeDataURL && (
                <img 
                  src={qrCodeDataURL} 
                  alt="Código QR de la reserva" 
                  className="img-fluid mb-3"
                  style={{ maxWidth: '200px' }}
                />
              )}
              <p className="text-muted small mb-0">
                Presente este código QR en el aeropuerto para verificar su reserva
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;