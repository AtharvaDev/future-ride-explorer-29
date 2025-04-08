
import { jsPDF } from 'jspdf';
import { BookingNotificationDetails } from '@/types/notifications';
import { format } from 'date-fns';

/**
 * Generate a PDF booking confirmation
 */
export const generateBookingPDF = (booking: BookingNotificationDetails): Blob => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add company logo and header
  doc.setFontSize(22);
  doc.setTextColor(33, 150, 243); // Primary blue color
  doc.text('The Chauffeur Co.', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Booking Confirmation', 105, 30, { align: 'center' });
  
  // Add booking details
  doc.setFontSize(12);
  doc.text(`Booking ID: ${booking.id}`, 20, 45);
  doc.text(`Date: ${format(new Date(), 'MMM dd, yyyy')}`, 20, 52);
  
  // Customer information
  doc.setFontSize(14);
  doc.text('Customer Information', 20, 65);
  doc.line(20, 67, 190, 67);
  
  doc.setFontSize(12);
  doc.text(`Name: ${booking.contactInfo.name}`, 20, 75);
  doc.text(`Email: ${booking.contactInfo.email}`, 20, 82);
  doc.text(`Phone: ${booking.contactInfo.phone}`, 20, 89);
  doc.text(`Starting City: ${booking.contactInfo.startCity}`, 20, 96);
  
  // Booking details
  doc.setFontSize(14);
  doc.text('Booking Details', 20, 110);
  doc.line(20, 112, 190, 112);
  
  doc.setFontSize(12);
  doc.text(`Car: ${booking.car.name}`, 20, 120);
  doc.text(`Start Date: ${format(booking.startDate, 'MMM dd, yyyy')}`, 20, 127);
  doc.text(`End Date: ${format(booking.endDate, 'MMM dd, yyyy')}`, 20, 134);
  doc.text(`Starting Location: ${booking.startCity}`, 20, 141);
  
  // Payment information
  doc.setFontSize(14);
  doc.text('Payment Information', 20, 155);
  doc.line(20, 157, 190, 157);
  
  doc.setFontSize(12);
  doc.text(`Total Amount: ₹${booking.paymentInfo.totalAmount.toFixed(2)}`, 20, 165);
  doc.text(`Token Amount Paid: ₹${booking.paymentInfo.tokenAmount.toFixed(2)}`, 20, 172);
  doc.text(`Payment Method: ${booking.paymentInfo.method}`, 20, 179);
  doc.text(`Payment Date: ${format(booking.paymentInfo.paidAt, 'MMM dd, yyyy')}`, 20, 186);
  
  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for choosing The Chauffeur Co. for your journey!', 105, 270, { align: 'center' });
  doc.text('For any assistance, call us at +91-8850414839', 105, 275, { align: 'center' });
  doc.text('© The Chauffeur Co. ' + new Date().getFullYear(), 105, 280, { align: 'center' });
  
  // Return the PDF as a blob
  return doc.output('blob');
};

/**
 * Generate a PDF invoice for a booking
 */
export const generateInvoicePDF = (booking: BookingNotificationDetails): Blob => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Similar implementation to the booking PDF but formatted as an invoice
  // For brevity, this is a placeholder
  
  doc.setFontSize(22);
  doc.setTextColor(33, 150, 243);
  doc.text('The Chauffeur Co.', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('TAX INVOICE', 105, 30, { align: 'center' });
  
  // Invoice details would be added here...
  
  return doc.output('blob');
};
