
// Define the booking details interface
export interface BookingNotificationDetails {
  customerName: string;
  carModel: string;
  carTitle: string;
  startDate: string;
  endDate: string;
  numDays: number;
  tokenAmount: number;
  totalAmount: number;
  customerPhone: string;
}

// Admin phone number to send notifications to (you can change this to your desired number)
const ADMIN_PHONE_NUMBER = "+919876543210"; // Change this to the actual admin number

/**
 * Sends a WhatsApp notification with booking details
 * @param bookingDetails Booking details to include in the notification
 */
export const sendWhatsAppNotification = async (bookingDetails: BookingNotificationDetails): Promise<void> => {
  try {
    const { 
      customerName, 
      carModel, 
      carTitle, 
      startDate, 
      endDate, 
      numDays, 
      tokenAmount, 
      totalAmount,
      customerPhone
    } = bookingDetails;
    
    // Create the message text
    const message = `
🚗 *New Booking Confirmation* 🚗

*Booking Details:*
Car: ${carModel} ${carTitle}
Duration: ${startDate} to ${endDate} (${numDays} days)
Token Amount Paid: ₹${tokenAmount.toLocaleString()}
Total Amount: ₹${totalAmount.toLocaleString()}

*Customer Details:*
Name: ${customerName}
Phone: ${customerPhone}

Thank you for your booking!
    `.trim();
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp API URL
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_PHONE_NUMBER}&text=${encodedMessage}`;
    
    // For web-based applications, we'll open the WhatsApp URL in a new window
    // This is a client-side approach, for production you might want to use a server-side API
    if (typeof window !== 'undefined') {
      // In a real application, you would use a proper WhatsApp Business API
      // For demo purposes, we're using the web link approach
      window.open(whatsappUrl, '_blank');
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return Promise.reject(error);
  }
};

/**
 * Alternative implementation using direct WhatsApp link (for testing)
 */
export const openWhatsAppWithBookingDetails = (bookingDetails: BookingNotificationDetails): void => {
  const { 
    customerName, 
    carModel, 
    carTitle, 
    startDate, 
    endDate, 
    numDays, 
    tokenAmount, 
    totalAmount 
  } = bookingDetails;
  
  const message = `
🚗 *New Booking Confirmation* 🚗

*Booking Details:*
Car: ${carModel} ${carTitle}
Duration: ${startDate} to ${endDate} (${numDays} days)
Token Amount Paid: ₹${tokenAmount.toLocaleString()}
Total Amount: ₹${totalAmount.toLocaleString()}

*Customer Details:*
Name: ${customerName}

Thank you for your booking!
  `.trim();
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_PHONE_NUMBER}&text=${encodedMessage}`;
  
  // Open WhatsApp in a new window
  window.open(whatsappUrl, '_blank');
};
