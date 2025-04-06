
import { AuthUser } from '@/types/auth';
import { format } from 'date-fns';
import emailConfig from '@/config/emailConfig';
import whatsAppConfig from '@/config/whatsAppConfig';
import { BookingNotificationDetails } from '@/types/notifications';
import { 
  sendEmail, 
  sendWhatsAppMessage, 
  sendSmsMessage 
} from './twilioService';
import twilioConfig from '@/config/twilioConfig';

// Function to replace template variables
const replaceTemplateVariables = (template: string, variables: Record<string, string | number>) => {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value.toString());
  }
  return result;
};

// Check if user notification is enabled for a specific type
const isUserNotificationEnabled = (type: keyof typeof whatsAppConfig.userNotifications) => {
  return (
    (emailConfig.enabled && emailConfig.userNotifications[type]) || 
    (whatsAppConfig.enabled && whatsAppConfig.userNotifications[type])
  );
};

// Check if admin notification is enabled for a specific type
const isAdminNotificationEnabled = (type: keyof typeof whatsAppConfig.adminNotifications) => {
  return (
    (emailConfig.enabled && emailConfig.adminNotifications[type]) || 
    (whatsAppConfig.enabled && whatsAppConfig.adminNotifications[type])
  );
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (booking: BookingNotificationDetails, user: AuthUser | null) => {
  // Early return if email notifications are disabled for this type
  if (!emailConfig.enabled || !emailConfig.userNotifications.bookingConfirmation) {
    console.log('[NOTIFICATION] Booking confirmation email notifications are disabled');
    return false;
  }

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
      to: [booking.contactInfo.email],
      subject,
      body,
    });

    // Send to admin if admin notifications are enabled
    if (emailConfig.adminNotifications.bookingConfirmation) {
      const adminBody = `
        <h2>New Booking Alert</h2>
        <p>A new booking has been made:</p>
        ${body}
        <p>User contact: ${booking.contactInfo.phone}</p>
        <p>User email: ${booking.contactInfo.email}</p>
      `;
      
      await sendEmail({
        to: emailConfig.adminEmails,
        subject: `ADMIN: ${subject}`,
        body: adminBody,
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
  // Early return if WhatsApp notifications are disabled for this type
  if (!whatsAppConfig.enabled || !whatsAppConfig.userNotifications.bookingConfirmation || 
      !twilioConfig.services.whatsapp.enabled || !twilioConfig.enabled) {
    console.log('[NOTIFICATION] WhatsApp booking confirmation notifications are disabled');
    return false;
  }

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
    
    // Send to user
    await sendWhatsAppMessage({
      to: booking.contactInfo.phone,
      body: message,
    });

    // Send to admin if admin notifications are enabled
    if (whatsAppConfig.adminNotifications.bookingConfirmation) {
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
  const promises = [];
  
  // Only attempt to send notifications that are enabled
  if (emailConfig.enabled && emailConfig.userNotifications.bookingConfirmation) {
    promises.push(sendBookingConfirmationEmail(booking, user));
  }
  
  if (whatsAppConfig.enabled && whatsAppConfig.userNotifications.bookingConfirmation) {
    promises.push(sendBookingConfirmationWhatsApp(booking));
  }
  
  // If no notifications are enabled, return early
  if (promises.length === 0) {
    console.log('[NOTIFICATION] All booking confirmation notifications are disabled');
    return false;
  }
  
  await Promise.all(promises);
  return true;
};

// Send notification about new user signup
export const sendNewUserSignupNotification = async (user: AuthUser) => {
  const promises = [];
  
  // Check if WhatsApp admin notifications are enabled for user signup
  if (whatsAppConfig.enabled && whatsAppConfig.adminNotifications.userSignup && 
      twilioConfig.services.whatsapp.enabled && twilioConfig.enabled) {
    const message = `
🔔 *ADMIN NOTIFICATION: New User Signup*

A new user has registered:
• Name: ${user.displayName || 'Not provided'}
• Email: ${user.email || 'Not provided'}
• Phone: ${user.phone || 'Not provided'}
• User ID: ${user.uid}
• Signup Time: ${format(new Date(), 'MMM dd, yyyy HH:mm:ss')}
    `;

    promises.push(sendWhatsAppMessage({
      to: whatsAppConfig.adminNumber,
      body: message,
    }));
  }
  
  // Check if email admin notifications are enabled for user signup
  if (emailConfig.enabled && emailConfig.adminNotifications.userSignup) {
    const subject = 'New User Registration';
    const body = `
      <h2>New User Registration</h2>
      <p>A new user has registered on your platform:</p>
      <ul>
        <li>Name: ${user.displayName || 'Not provided'}</li>
        <li>Email: ${user.email || 'Not provided'}</li>
        <li>Phone: ${user.phone || 'Not provided'}</li>
        <li>User ID: ${user.uid}</li>
        <li>Signup Time: ${format(new Date(), 'MMM dd, yyyy HH:mm:ss')}</li>
      </ul>
    `;
    
    promises.push(sendEmail({
      to: emailConfig.adminEmails,
      subject,
      body,
    }));
  }
  
  // If no notifications are enabled, return early
  if (promises.length === 0) {
    console.log('[NOTIFICATION] All user signup notifications are disabled');
    return false;
  }
  
  await Promise.all(promises);
  console.log(`Admin notified about new user signup: ${user.email}`);
  return true;
};

// Send notification about user profile update
export const sendProfileUpdateNotification = async (user: AuthUser, updatedFields: Record<string, any>) => {
  const promises = [];
  
  // Check if admin notifications are enabled for profile updates
  if (whatsAppConfig.enabled && whatsAppConfig.adminNotifications.profileUpdate && 
      twilioConfig.services.whatsapp.enabled && twilioConfig.enabled) {
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

    promises.push(sendWhatsAppMessage({
      to: whatsAppConfig.adminNumber,
      body: message,
    }));
  }
  
  // Check if email admin notifications are enabled for profile updates
  if (emailConfig.enabled && emailConfig.adminNotifications.profileUpdate) {
    let updatedFieldsHtml = '<ul>';
    for (const [key, value] of Object.entries(updatedFields)) {
      updatedFieldsHtml += `<li>${key}: ${value}</li>`;
    }
    updatedFieldsHtml += '</ul>';
    
    const subject = 'User Profile Update';
    const body = `
      <h2>User Profile Update</h2>
      <p>A user has updated their profile:</p>
      <ul>
        <li>Name: ${user.displayName || 'Not provided'}</li>
        <li>Email: ${user.email || 'Not provided'}</li>
        <li>User ID: ${user.uid}</li>
      </ul>
      <p>Updated fields:</p>
      ${updatedFieldsHtml}
    `;
    
    promises.push(sendEmail({
      to: emailConfig.adminEmails,
      subject,
      body,
    }));
  }
  
  // If no notifications are enabled, return early
  if (promises.length === 0) {
    console.log('[NOTIFICATION] All profile update notifications are disabled');
    return false;
  }
  
  await Promise.all(promises);
  console.log(`Admin notified about profile update for user: ${user.email}`);
  return true;
};

// Send notification about booking attempt (when user starts the booking process)
export const sendBookingAttemptNotification = async (user: AuthUser | null, carDetails: any, contactInfo: any) => {
  const promises = [];
  
  // Check if WhatsApp admin notifications are enabled for booking attempts
  if (whatsAppConfig.enabled && whatsAppConfig.adminNotifications.bookingAttempt && 
      twilioConfig.services.whatsapp.enabled && twilioConfig.enabled) {
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

    promises.push(sendWhatsAppMessage({
      to: whatsAppConfig.adminNumber,
      body: message,
    }));
  }
  
  // Check if email admin notifications are enabled for booking attempts
  if (emailConfig.enabled && emailConfig.adminNotifications.bookingAttempt) {
    const subject = 'New Booking Attempt';
    const body = `
      <h2>New Booking Attempt</h2>
      <p>A user is attempting to book a car:</p>
      <ul>
        <li>Name: ${contactInfo.name || (user?.displayName || 'Not provided')}</li>
        <li>Email: ${contactInfo.email || (user?.email || 'Not provided')}</li>
        <li>Phone: ${contactInfo.phone || (user?.phone || 'Not provided')}</li>
        ${user ? `<li>User ID: ${user.uid}</li>` : '<li>User: Not logged in</li>'}
      </ul>
      <p>Car Details:</p>
      <ul>
        <li>Model: ${carDetails.model || carDetails.title || 'Not specified'}</li>
        <li>ID: ${carDetails.id || 'Not specified'}</li>
      </ul>
    `;
    
    promises.push(sendEmail({
      to: emailConfig.adminEmails,
      subject,
      body,
    }));
  }
  
  // If no notifications are enabled, return early
  if (promises.length === 0) {
    console.log('[NOTIFICATION] All booking attempt notifications are disabled');
    return false;
  }
  
  await Promise.all(promises);
  console.log(`Admin notified about booking attempt`);
  return true;
};

// Export other notification functions
export const sendPaymentConfirmation = async (booking: BookingNotificationDetails, user: AuthUser | null) => {
  const promises = [];
  
  // Check if email notifications are enabled for payment confirmations
  if (emailConfig.enabled && emailConfig.userNotifications.paymentConfirmation) {
    const variables = {
      name: booking.contactInfo.name,
      bookingId: booking.id,
      amountPaid: booking.paymentInfo.totalAmount.toFixed(2),
      paymentDate: format(booking.paymentInfo.paidAt, 'MMM dd, yyyy'),
      paymentMethod: booking.paymentInfo.method,
    };

    const subject = replaceTemplateVariables(emailConfig.templates.paymentConfirmation.subject, variables);
    const body = replaceTemplateVariables(emailConfig.templates.paymentConfirmation.body, variables);

    promises.push(sendEmail({
      to: [booking.contactInfo.email],
      subject,
      body,
    }));
    
    // Send to admin if admin notifications are enabled
    if (emailConfig.adminNotifications.paymentConfirmation) {
      const adminBody = `
        <h2>Payment Confirmation</h2>
        <p>A payment has been received:</p>
        ${body}
        <p>User contact: ${booking.contactInfo.phone}</p>
        <p>User email: ${booking.contactInfo.email}</p>
      `;
      
      promises.push(sendEmail({
        to: emailConfig.adminEmails,
        subject: `ADMIN: ${subject}`,
        body: adminBody,
      }));
    }
  }
  
  // Check if WhatsApp notifications are enabled for payment confirmations
  if (whatsAppConfig.enabled && whatsAppConfig.userNotifications.paymentConfirmation) {
    const variables = {
      name: booking.contactInfo.name,
      bookingId: booking.id,
      amountPaid: booking.paymentInfo.totalAmount.toFixed(2),
      paymentDate: format(booking.paymentInfo.paidAt, 'MMM dd, yyyy'),
      paymentMethod: booking.paymentInfo.method,
    };

    const message = replaceTemplateVariables(whatsAppConfig.templates.paymentConfirmation, variables);
    
    promises.push(sendWhatsAppMessage({
      to: booking.contactInfo.phone,
      body: message,
    }));
    
    // Send to admin if admin notifications are enabled
    if (whatsAppConfig.adminNotifications.paymentConfirmation) {
      const adminMessage = `
🔔 *ADMIN NOTIFICATION: Payment Received*

A payment has been received:
• User: ${booking.contactInfo.name}
• Email: ${booking.contactInfo.email}
• Booking ID: ${booking.id}
• Amount: ₹${booking.paymentInfo.totalAmount.toFixed(2)}
• Payment Method: ${booking.paymentInfo.method}
      `;
      
      promises.push(sendWhatsAppMessage({
        to: whatsAppConfig.adminNumber,
        body: adminMessage,
      }));
    }
  }
  
  // If no notifications are enabled, return early
  if (promises.length === 0) {
    console.log('[NOTIFICATION] All payment confirmation notifications are disabled');
    return false;
  }
  
  await Promise.all(promises);
  return true;
};

export const sendBookingReminder = async (booking: BookingNotificationDetails, user: AuthUser | null) => {
  // Implementation similar to other notification functions
  return true;
};

export const sendBookingCancellation = async (booking: BookingNotificationDetails, user: AuthUser | null) => {
  // Implementation similar to other notification functions
  return true;
};
