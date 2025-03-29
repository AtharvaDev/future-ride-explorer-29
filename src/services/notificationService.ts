
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
  customerEmail: string;
  paymentMethod?: string;
  paymentId?: string;
}

// Admin contact details
const ADMIN_PHONE_NUMBER = "+919876543210"; // Change this to the actual admin number
const ADMIN_EMAIL = "admin@futureride.com"; // Change this to the actual admin email

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
      customerPhone,
      paymentMethod,
      paymentId
    } = bookingDetails;
    
    // Create the message text
    const message = `
🚗 *New Booking Confirmation* 🚗

*Booking Details:*
Car: ${carModel} ${carTitle}
Duration: ${startDate} to ${endDate} (${numDays} days)
Token Amount Paid: ₹${tokenAmount.toLocaleString()}
Total Amount: ₹${totalAmount.toLocaleString()}
Payment Method: ${paymentMethod || 'UPI'}
${paymentId ? `Payment ID: ${paymentId}` : ''}

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
    
    // Also send to customer if customer phone is different from admin
    if (customerPhone && customerPhone !== ADMIN_PHONE_NUMBER) {
      const customerMessage = `
🚗 *Your Booking Confirmation* 🚗

Thank you for booking with Future Ride!

*Booking Details:*
Car: ${carModel} ${carTitle}
Duration: ${startDate} to ${endDate} (${numDays} days)
Token Amount Paid: ₹${tokenAmount.toLocaleString()}
Total Amount: ₹${totalAmount.toLocaleString()}

Our team will contact you shortly for further details.
Thank you for choosing Future Ride!
      `.trim();
      
      const encodedCustomerMessage = encodeURIComponent(customerMessage);
      const customerWhatsappUrl = `https://api.whatsapp.com/send?phone=${customerPhone}&text=${encodedCustomerMessage}`;
      
      // Open in a new window with slight delay
      setTimeout(() => {
        window.open(customerWhatsappUrl, '_blank');
      }, 1000);
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return Promise.reject(error);
  }
};

/**
 * Sends email notifications about the booking
 * In a real application, this would connect to an email service
 */
export const sendEmailNotification = async (bookingDetails: BookingNotificationDetails): Promise<void> => {
  try {
    const { 
      customerName, 
      customerEmail,
      carModel, 
      carTitle, 
      startDate, 
      endDate, 
      numDays, 
      tokenAmount, 
      totalAmount
    } = bookingDetails;
    
    console.log(`Email notification would be sent to ${ADMIN_EMAIL} and ${customerEmail}`);
    
    // In a real application, you would use an email service API here
    // This is just a placeholder to show the concept
    
    // Log the admin email content
    console.log(`
Subject: New Booking - ${carModel} ${carTitle}

Hello Admin,

A new booking has been made:

Customer: ${customerName}
Car: ${carModel} ${carTitle}
Duration: ${startDate} to ${endDate} (${numDays} days)
Token Amount Paid: ₹${tokenAmount.toLocaleString()}
Total Amount: ₹${totalAmount.toLocaleString()}

Please contact the customer to confirm the details.

Future Ride Team
    `);
    
    // Log the customer email content
    console.log(`
Subject: Your Booking Confirmation - Future Ride

Hello ${customerName},

Thank you for booking with Future Ride!

Booking Details:
Car: ${carModel} ${carTitle}
Duration: ${startDate} to ${endDate} (${numDays} days)
Token Amount Paid: ₹${tokenAmount.toLocaleString()}
Total Amount: ₹${totalAmount.toLocaleString()}

Our team will contact you shortly for further details.
Thank you for choosing Future Ride!

Future Ride Team
    `);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error sending email notification:', error);
    return Promise.reject(error);
  }
};

/**
 * Send all notifications (WhatsApp and Email)
 */
export const sendAllNotifications = async (bookingDetails: BookingNotificationDetails): Promise<void> => {
  try {
    // Send WhatsApp notification
    await sendWhatsAppNotification(bookingDetails);
    
    // Send Email notification
    await sendEmailNotification(bookingDetails);
    
    console.log('All notifications sent successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('Error sending notifications:', error);
    return Promise.reject(error);
  }
};

/**
 * Send notification for new contact information
 */
export const sendContactNotification = async (contactInfo: {
  name: string;
  email: string;
  phone: string;
  startCity: string;
}): Promise<void> => {
  try {
    const { name, email, phone, startCity } = contactInfo;
    
    // Create the message text
    const message = `
👤 *New Customer Inquiry* 👤

*Customer Details:*
Name: ${name}
Email: ${email}
Phone: ${phone}
Starting City: ${startCity}

A new customer has filled in their contact details on your website.
    `.trim();
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp API URL
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_PHONE_NUMBER}&text=${encodedMessage}`;
    
    // Open WhatsApp message in a new window
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error sending contact notification:', error);
    return Promise.reject(error);
  }
};
