
import { format } from 'date-fns';
import { toast } from 'sonner';
import { emailConfig, whatsAppConfig } from '@/config/notifications';
import { Booking } from '@/types/booking';
import { User } from 'firebase/auth';

// Dummy functions for email and WhatsApp integration that would be replaced with actual API calls
const sendEmail = async (to: string, subject: string, body: string, from: string) => {
  console.log(`Sending email to ${to} from ${from}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  // In a real app, this would make an API call to your email service
  // Example: return await emailServiceAPI.send({ to, subject, body, from });
  
  // For now, we'll just simulate a successful send
  return { success: true, messageId: `email_${Date.now()}` };
};

const sendWhatsApp = async (to: string, body: string, from: string) => {
  console.log(`Sending WhatsApp message to ${to} from ${from}`);
  console.log(`Message: ${body}`);
  
  // In a real app, this would make an API call to WhatsApp Business API or similar
  // Example: return await whatsappAPI.send({ to, body, from });
  
  // For now, we'll just simulate a successful send
  return { success: true, messageId: `whatsapp_${Date.now()}` };
};

// Helper function to replace template variables
const replaceTemplateVariables = (template: string, variables: Record<string, string>) => {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
};

// Get common template variables for a booking
const getBookingTemplateVariables = (booking: Booking, user: User | null) => {
  return {
    name: user?.displayName || booking.contactInfo?.name || 'Customer',
    bookingId: booking.id || '',
    carTitle: booking.car?.title || '',
    carModel: booking.car?.model || '',
    startDate: booking.startDate ? format(booking.startDate, 'MMM dd, yyyy') : '',
    endDate: booking.endDate ? format(booking.endDate, 'MMM dd, yyyy') : '',
    startCity: booking.startCity || '',
    totalAmount: booking.paymentInfo?.totalAmount?.toString() || '',
    tokenAmount: booking.paymentInfo?.tokenAmount?.toString() || '',
    bookingUrl: `${window.location.origin}/my-bookings`,
    paymentDate: new Date().toLocaleDateString(),
    paymentMethod: 'Credit Card', // This would normally come from the payment record
    amountPaid: booking.paymentInfo?.tokenAmount?.toString() || ''
  };
};

// Send booking confirmation notifications
export const sendBookingConfirmation = async (booking: Booking, user: User | null) => {
  try {
    const variables = getBookingTemplateVariables(booking, user);
    
    // Send email notification if enabled
    if (emailConfig.enabled && booking.contactInfo?.email) {
      const subject = replaceTemplateVariables(emailConfig.templates.bookingConfirmation.subject, variables);
      const body = replaceTemplateVariables(emailConfig.templates.bookingConfirmation.body, variables);
      
      await sendEmail(
        booking.contactInfo.email,
        subject,
        body,
        `${emailConfig.sender.name} <${emailConfig.sender.email}>`
      );
    }
    
    // Send WhatsApp notification if enabled
    if (whatsAppConfig.enabled && booking.contactInfo?.phone) {
      const message = replaceTemplateVariables(whatsAppConfig.templates.bookingConfirmation, variables);
      
      await sendWhatsApp(
        booking.contactInfo.phone,
        message,
        whatsAppConfig.sender.phone
      );
    }
    
    toast.success('Booking confirmation notifications sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending booking confirmation notifications:', error);
    toast.error('Failed to send booking notifications');
    return false;
  }
};

// Send payment confirmation notifications
export const sendPaymentConfirmation = async (booking: Booking, user: User | null) => {
  try {
    const variables = getBookingTemplateVariables(booking, user);
    
    // Send email notification if enabled
    if (emailConfig.enabled && booking.contactInfo?.email) {
      const subject = replaceTemplateVariables(emailConfig.templates.paymentConfirmation.subject, variables);
      const body = replaceTemplateVariables(emailConfig.templates.paymentConfirmation.body, variables);
      
      await sendEmail(
        booking.contactInfo.email,
        subject,
        body,
        `${emailConfig.sender.name} <${emailConfig.sender.email}>`
      );
    }
    
    // Send WhatsApp notification if enabled
    if (whatsAppConfig.enabled && booking.contactInfo?.phone) {
      const message = replaceTemplateVariables(whatsAppConfig.templates.paymentConfirmation, variables);
      
      await sendWhatsApp(
        booking.contactInfo.phone,
        message,
        whatsAppConfig.sender.phone
      );
    }
    
    toast.success('Payment confirmation notifications sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending payment confirmation notifications:', error);
    toast.error('Failed to send payment notifications');
    return false;
  }
};

// Send booking reminder notifications
export const sendBookingReminder = async (booking: Booking, user: User | null) => {
  try {
    const variables = getBookingTemplateVariables(booking, user);
    
    // Send email notification if enabled
    if (emailConfig.enabled && booking.contactInfo?.email) {
      const subject = replaceTemplateVariables(emailConfig.templates.bookingReminder.subject, variables);
      const body = replaceTemplateVariables(emailConfig.templates.bookingReminder.body, variables);
      
      await sendEmail(
        booking.contactInfo.email,
        subject,
        body,
        `${emailConfig.sender.name} <${emailConfig.sender.email}>`
      );
    }
    
    // Send WhatsApp notification if enabled
    if (whatsAppConfig.enabled && booking.contactInfo?.phone) {
      const message = replaceTemplateVariables(whatsAppConfig.templates.bookingReminder, variables);
      
      await sendWhatsApp(
        booking.contactInfo.phone,
        message,
        whatsAppConfig.sender.phone
      );
    }
    
    toast.success('Booking reminder notifications sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending booking reminder notifications:', error);
    toast.error('Failed to send reminder notifications');
    return false;
  }
};

// Send booking cancellation notifications
export const sendBookingCancellation = async (booking: Booking, user: User | null) => {
  try {
    const variables = getBookingTemplateVariables(booking, user);
    
    // Send email notification if enabled
    if (emailConfig.enabled && booking.contactInfo?.email) {
      const subject = replaceTemplateVariables(emailConfig.templates.bookingCancellation.subject, variables);
      const body = replaceTemplateVariables(emailConfig.templates.bookingCancellation.body, variables);
      
      await sendEmail(
        booking.contactInfo.email,
        subject,
        body,
        `${emailConfig.sender.name} <${emailConfig.sender.email}>`
      );
    }
    
    // Send WhatsApp notification if enabled
    if (whatsAppConfig.enabled && booking.contactInfo?.phone) {
      const message = replaceTemplateVariables(whatsAppConfig.templates.bookingCancellation, variables);
      
      await sendWhatsApp(
        booking.contactInfo.phone,
        message,
        whatsAppConfig.sender.phone
      );
    }
    
    toast.success('Booking cancellation notifications sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending booking cancellation notifications:', error);
    toast.error('Failed to send cancellation notifications');
    return false;
  }
};
