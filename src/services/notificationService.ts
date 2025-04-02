
import { AuthUser } from '@/types/auth';
import { format } from 'date-fns';
import { emailConfig, whatsAppConfig } from '@/config/notifications';
import { BookingNotificationDetails } from '@/types/notifications';
import { 
  sendEmail, 
  sendWhatsAppMessage, 
  sendSmsMessage 
} from './twilioService';

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
      carModel: booking.car.name,
      startDate: format(booking.startDate, 'MMM dd, yyyy'),
      endDate: format(booking.endDate, 'MMM dd, yyyy'),
      startCity: booking.startCity,
      totalAmount: booking.paymentInfo.totalAmount.toFixed(2),
      tokenAmount: booking.paymentInfo.tokenAmount.toFixed(2),
      bookingUrl: `${window.location.origin}/my-bookings`,
    };

    const subject = replaceTemplateVariables(emailConfig.templates.bookingConfirmation.subject, variables);
    const body = replaceTemplateVariables(emailConfig.templates.bookingConfirmation.body, variables);

    // Send to user
    await sendEmail({
      to: booking.contactInfo.email,
      subject,
      body,
    });

    // Send to admin
    if (emailConfig.adminNotifications?.bookingConfirmation) {
      await sendEmail({
        to: emailConfig.sender.email,
        subject: `ADMIN: ${subject}`,
        body: `
          <h2>New Booking Alert</h2>
          <p>A new booking has been made:</p>
          ${body}
          <p>User contact: ${booking.contactInfo.phone}</p>
          <p>User email: ${booking.contactInfo.email}</p>
        `,
      });
    }

    console.log(`Email notification sent to ${booking.contactInfo.email} and admin`);
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

    // Send to user
    await sendWhatsAppMessage({
      to: phoneNumber,
      body: message,
    });

    // Send to admin
    if (whatsAppConfig.adminNotifications?.bookingConfirmation) {
      const adminMessage = `
🔔 *ADMIN NOTIFICATION: New Booking*

A new booking has been made:
• User: ${booking.contactInfo.name}
• Email: ${booking.contactInfo.email}
• Phone: ${booking.contactInfo.phone}
• Booking ID: ${booking.id}
• Car: ${booking.car.name}
• Dates: ${format(booking.startDate, 'MMM dd, yyyy')} to ${format(booking.endDate, 'MMM dd, yyyy')}
• Amount: ₹${booking.paymentInfo.totalAmount.toFixed(2)}
      `;
      
      await sendWhatsAppMessage({
        to: whatsAppConfig.adminNumber,
        body: adminMessage,
      });
    }

    console.log(`WhatsApp notification sent to ${booking.contactInfo.phone} and admin`);
    return true;
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

// Send notification about new user signup
export const sendNewUserSignupNotification = async (user: AuthUser) => {
  if (!whatsAppConfig.enabled || !whatsAppConfig.adminNotifications?.userSignup) return;

  try {
    const message = `
🔔 *ADMIN NOTIFICATION: New User Signup*

A new user has registered:
• Name: ${user.displayName || 'Not provided'}
• Email: ${user.email || 'Not provided'}
• Phone: ${user.phone || 'Not provided'}
• User ID: ${user.uid}
• Signup Time: ${format(new Date(), 'MMM dd, yyyy HH:mm:ss')}
    `;

    await sendWhatsAppMessage({
      to: whatsAppConfig.adminNumber,
      body: message,
    });

    console.log(`Admin notified about new user signup: ${user.email}`);
    return true;
  } catch (error) {
    console.error('Error sending new user notification:', error);
    return false;
  }
};

// Send notification about user profile update
export const sendProfileUpdateNotification = async (user: AuthUser, updatedFields: Record<string, any>) => {
  if (!whatsAppConfig.enabled || !whatsAppConfig.adminNotifications?.profileUpdate) return;

  try {
    let updatedFieldsList = '';
    for (const [key, value] of Object.entries(updatedFields)) {
      updatedFieldsList += `• ${key}: ${value}\n`;
    }

    const message = `
🔔 *ADMIN NOTIFICATION: User Profile Update*

A user has updated their profile:
• Name: ${user.displayName || 'Not provided'}
• Email: ${user.email || 'Not provided'}
• User ID: ${user.uid}

Updated fields:
${updatedFieldsList}
    `;

    await sendWhatsAppMessage({
      to: whatsAppConfig.adminNumber,
      body: message,
    });

    console.log(`Admin notified about profile update for user: ${user.email}`);
    return true;
  } catch (error) {
    console.error('Error sending profile update notification:', error);
    return false;
  }
};

// Send notification about booking attempt (when user starts the booking process)
export const sendBookingAttemptNotification = async (user: AuthUser | null, carDetails: any, contactInfo: any) => {
  if (!whatsAppConfig.enabled || !whatsAppConfig.adminNotifications?.bookingAttempt) return;

  try {
    const message = `
🔔 *ADMIN NOTIFICATION: Booking Attempt*

A user is attempting to book a car:
• Name: ${contactInfo.name || (user?.displayName || 'Not provided')}
• Email: ${contactInfo.email || (user?.email || 'Not provided')}
• Phone: ${contactInfo.phone || (user?.phone || 'Not provided')}
${user ? `• User ID: ${user.uid}` : '• User: Not logged in'}

Car Details:
• Model: ${carDetails.model || carDetails.title || 'Not specified'}
• ID: ${carDetails.id || 'Not specified'}
    `;

    await sendWhatsAppMessage({
      to: whatsAppConfig.adminNumber,
      body: message,
    });

    console.log(`Admin notified about booking attempt`);
    return true;
  } catch (error) {
    console.error('Error sending booking attempt notification:', error);
    return false;
  }
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
