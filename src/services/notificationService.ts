
import { AuthUser } from '@/types/auth';
import { format } from 'date-fns';
import { emailConfig, whatsAppConfig } from '@/config/notifications';
import { BookingNotificationDetails } from '@/types/notifications';
import { sendEmail, sendWhatsAppMessage } from './twilioService';

// Function to replace template variables
const replaceTemplateVariables = (template: string, variables: Record<string, string | number>) => {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value.toString());
  }
  return result;
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (booking: BookingNotificationDetails, user: AuthUser | null) => {
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

    // Use our twilioService to send the email
    const sent = await sendEmail({
      to: booking.contactInfo.email,
      subject,
      body,
    });

    if (sent) {
      console.log(`Email notification sent to ${booking.contactInfo.email}`);
      return true;
    } else {
      console.error('Failed to send email notification');
      return false;
    }
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
    
    // Format the phone number for WhatsApp (add whatsapp: prefix if not present)
    let phoneNumber = booking.contactInfo.phone;
    if (!phoneNumber.startsWith('whatsapp:')) {
      // Remove any non-digit characters for standardization
      phoneNumber = phoneNumber.replace(/\D/g, '');
      // Add country code if not present (assuming India +91)
      if (!phoneNumber.startsWith('91') && phoneNumber.length === 10) {
        phoneNumber = `91${phoneNumber}`;
      }
      phoneNumber = `whatsapp:+${phoneNumber}`;
    }

    // Use our twilioService to send the WhatsApp message
    const sent = await sendWhatsAppMessage({
      to: phoneNumber,
      body: message,
    });

    if (sent) {
      console.log(`WhatsApp notification sent to ${booking.contactInfo.phone}`);
      return true;
    } else {
      console.error('Failed to send WhatsApp notification');
      return false;
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
};

// Send booking confirmation notifications through all enabled channels
export const sendBookingConfirmation = async (
  booking: BookingNotificationDetails, 
  user: AuthUser | null
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
