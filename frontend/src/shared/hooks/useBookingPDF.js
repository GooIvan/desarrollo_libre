import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export const useBookingPDF = () => {
  const generateBookingCode = () => {
    // Generar un código único de reserva
    return 'RES-' + uuidv4().substring(0, 8).toUpperCase();
  };

  const generateQRCode = async (bookingData) => {
    try {
      const qrData = JSON.stringify({
        bookingCode: bookingData.bookingCode,
        flightId: bookingData.flightId,
        passengers: bookingData.passengers.length,
        date: new Date().toISOString()
      });
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };

  const generateBookingPDF = async (bookingData) => {
    try {
      const bookingCode = generateBookingCode();
      const qrCodeDataURL = await generateQRCode({ ...bookingData, bookingCode });

      // Crear nuevo documento PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;

      // Configuración de colores y fuentes
      const primaryColor = [102, 66, 193]; // #6642c1
      const lightGray = [248, 249, 250]; // #f8f9fa
      const darkGray = [52, 58, 64]; // #343a40

      // Header con color de fondo
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, 0, pageWidth, 40, 'F');

      // Logo/Título de la aerolínea
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Pragma', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Confirmación de Reserva', pageWidth / 2, 30, { align: 'center' });

      // Código de reserva destacado
      pdf.setFillColor(...lightGray);
      pdf.rect(15, 50, pageWidth - 30, 25, 'F');
      
      pdf.setTextColor(...darkGray);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Código de Reserva: ${bookingCode}`, pageWidth / 2, 65, { align: 'center' });

      // Información del vuelo
      let yPosition = 90;
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...primaryColor);
      pdf.text('Detalles del Vuelo', 20, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...darkGray);
      
      if (bookingData.flight) {
        pdf.text(`Ruta: ${bookingData.flight.origen || 'N/A'} → ${bookingData.flight.destino || 'N/A'}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Fecha de Salida: ${bookingData.flight.fechaSalida || 'N/A'}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Hora de Salida: ${bookingData.flight.horaSalida || 'N/A'}`, 20, yPosition);
        yPosition += 8;
      }
      
      pdf.text(`ID de Vuelo: ${bookingData.flightId}`, 20, yPosition);
      yPosition += 20;

      // Información de pasajeros
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...primaryColor);
      pdf.text('Pasajeros', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...darkGray);

      bookingData.passengers.forEach((passenger, index) => {
        const passengerName = `${passenger.firstName || ''} ${passenger.lastName || ''}`.trim();
        const seatInfo = bookingData.seats && bookingData.seats[index] ? ` - Asiento ${bookingData.seats[index]}` : '';
        const payerInfo = passenger.esPagante ? ' (Pagante)' : '';
        
        pdf.text(`${index + 1}. ${passengerName}${seatInfo}${payerInfo}`, 25, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Código QR
      if (qrCodeDataURL) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...primaryColor);
        pdf.text('Código QR de Verificación', 20, yPosition);
        yPosition += 15;

        // Agregar imagen QR
        pdf.addImage(qrCodeDataURL, 'PNG', 20, yPosition, 40, 40);
        
        // Instrucciones del QR
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...darkGray);
        pdf.text('Presente este código QR', 70, yPosition + 10);
        pdf.text('en el aeropuerto para', 70, yPosition + 18);
        pdf.text('verificar su reserva', 70, yPosition + 26);
        
        yPosition += 50;
      }

      // Información importante
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...primaryColor);
      pdf.text('Información Importante', 20, yPosition);
      yPosition += 12;

      const importantInfo = [
        '• Llegue al aeropuerto con al menos 2 horas de anticipación',
        '• Presente su documento de identidad al momento del check-in',
        '• Conserve este comprobante hasta completar su viaje',
        '• En caso de cambios, contacte a nuestro servicio al cliente'
      ];

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...darkGray);

      importantInfo.forEach(info => {
        pdf.text(info, 20, yPosition);
        yPosition += 8;
      });

      // Footer
      yPosition = pageHeight - 30;
      pdf.setFillColor(...lightGray);
      pdf.rect(0, yPosition - 5, pageWidth, 25, 'F');
      
      pdf.setFontSize(10);
      pdf.setTextColor(...darkGray);
      pdf.text('Pragma - Su compañía de confianza', pageWidth / 2, yPosition + 5, { align: 'center' });
      pdf.text(`Generado el: ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, pageWidth / 2, yPosition + 12, { align: 'center' });

      return { pdf, bookingCode };

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const downloadBookingPDF = async (bookingData) => {
    try {
      const { pdf, bookingCode } = await generateBookingPDF(bookingData);
      const fileName = `Reserva-${bookingCode}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      return bookingCode;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
      return null;
    }
  };

  return {
    generateBookingPDF,
    downloadBookingPDF,
    generateBookingCode,
    generateQRCode
  };
};