import { User } from '@/types/auth';
import { format } from 'date-fns';
import { emailConfig, whatsAppConfig } from '@/config/notifications';
import { BookingNotificationDetails } from '@/types/notifications';

// Function to replace template variables
const replaceTemplateVariables = (template: string, variables: Record<string, string | number>) => {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value.toString());
  }
  return result;
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (booking: BookingNotificationDetails, user: User | null) => {
  if (!emailConfig.enabled) return;

  try {
    const variables = {
      name: booking.contactInfo.name,
      bookingId: booking.id,
      carTitle: booking.car.name,
      startDate: format(booking.startDate, 'MMM dd, yyyy'),
      endDate: format(booking.endDate, 'MMM dd, yyyy'),
      startCity: booking.startCity,
      totalAmount: booking.paymentInfo.totalAmount.toFixed(2),
      tokenAmount: booking.paymentInfo.tokenAmount.toFixed(2),
      bookingUrl: `${window.location.origin}/my-bookings`,
    };

    const subject = replaceTemplateVariables(emailConfig.templates.bookingConfirmation.subject, variables);
    const body = replaceTemplateVariables(emailConfig.templates.bookingConfirmation.body, variables);

    console.log('Sending booking confirmation email to:', booking.contactInfo.email);
    console.log('Subject:', subject);
    console.log('Body:', body);

    // In a real app, you would call an API to send the email
    // For now, we'll just log that we would send an email
    console.log(`Email notification sent to ${booking.contactInfo.email}`);
    
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
};

// Send booking confirmation WhatsApp message
export const sendBookingConfirmationWhatsApp = async (booking: BookingNotificationDetails) => {
  if (!whatsAppConfig.enabled) return;

  try {
    const variables = {
      name: booking.contactInfo.name,
      bookingId: booking.id,
      carModel: booking.car.name,
      startDate: format(booking.startDate, 'MMM dd, yyyy'),
      endDate: format(booking.endDate, 'MMM dd, yyyy'),
      startCity: booking.startCity,
      totalAmount: booking.paymentInfo.totalAmount.toFixed(2),
      tokenAmount: booking.paymentInfo.tokenAmount.toFixed(2),
      bookingUrl: `${window.location.origin}/my-bookings`,
    };

    const message = replaceTemplateVariables(whatsAppConfig.templates.bookingConfirmation, variables);

    console.log('Sending WhatsApp message to:', booking.contactInfo.phone);
    console.log('Message:', message);

    // In a real app, you would call WhatsApp Business API
    // For now, we'll just log that we would send a WhatsApp message
    console.log(`WhatsApp notification sent to ${booking.contactInfo.phone}`);
    
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
};

// Send booking confirmation notifications through all enabled channels
export const sendBookingConfirmation = async (
  booking: BookingNotificationDetails, 
  user: User | null
) => {
  const emailPromise = sendBookingConfirmationEmail(booking, user);
  const whatsAppPromise = sendBookingConfirmationWhatsApp(booking);
  
  await Promise.all([emailPromise, whatsAppPromise]);
  
  return true;
};

// Export other notification functions to be implemented as needed
export const sendPaymentConfirmation = async () => {
  // Implementation would be similar to booking confirmation
  return true;
};

export const sendBookingReminder = async () => {
  // Implementation would be similar to booking confirmation
  return true;
};

export const sendBookingCancellation = async () => {
  // Implementation would be similar to booking confirmation
  return true;
};
