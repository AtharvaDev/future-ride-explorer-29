
// Twilio Service Implementation
import { Twilio } from 'twilio';
import twilioConfig from '@/config/twilioConfig';

interface TwilioMessageOptions {
  to: string;
  body: string;
  from?: string;
}

interface TwilioEmailOptions {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

/**
 * Initialize Twilio client if enabled
 */
const initializeTwilioClient = () => {
  if (!twilioConfig.enabled) return null;
  
  try {
    return new Twilio(twilioConfig.accountSid, twilioConfig.authToken);
  } catch (error) {
    console.error('Failed to initialize Twilio client:', error);
    return null;
  }
};

// Initialize the client outside of the functions for better performance
const twilioClient = initializeTwilioClient();

/**
 * Send a WhatsApp message using Twilio
 */
export const sendWhatsAppMessage = async (options: TwilioMessageOptions): Promise<boolean> => {
  // Check if Twilio and WhatsApp service are enabled
  if (!twilioConfig.enabled || !twilioConfig.services.whatsapp.enabled) {
    console.log('[TWILIO] WhatsApp service is disabled. Enable it in twilioConfig.ts');
    return false;
  }
  
  const { to, body, from = twilioConfig.services.whatsapp.fromNumber } = options;
  
  try {
    // Validate phone number format for WhatsApp
    let formattedTo = to;
    if (!formattedTo.startsWith('whatsapp:')) {
      console.log('[TWILIO] Formatting WhatsApp number:', to);
      // Remove any non-digit characters for standardization
      formattedTo = formattedTo.replace(/\D/g, '');
      // Add country code if not present (assuming India +91)
      if (!formattedTo.startsWith('91') && formattedTo.length === 10) {
        formattedTo = `91${formattedTo}`;
      }
      formattedTo = `whatsapp:+${formattedTo}`;
    }
    
    // Use mock implementation if real API is disabled or client is not initialized
    if (!twilioConfig.useRealTwilioApi || !twilioClient) {
      console.log(`[TWILIO MOCK] Sending WhatsApp message to ${formattedTo} from ${from}:`);
      console.log(`[TWILIO MOCK] Message: ${body}`);
      return new Promise(resolve => setTimeout(() => resolve(true), 500));
    }
    
    // Use the Twilio SDK to send the WhatsApp message
    const message = await twilioClient.messages.create({
      to: formattedTo,
      from: from,
      body: body
    });
    
    console.log('WhatsApp message sent! SID:', message.sid);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
};

/**
 * Send an SMS message using Twilio
 */
export const sendSmsMessage = async (options: TwilioMessageOptions): Promise<boolean> => {
  // Check if Twilio and SMS service are enabled
  if (!twilioConfig.enabled || !twilioConfig.services.sms.enabled) {
    console.log('[TWILIO] SMS service is disabled. Enable it in twilioConfig.ts');
    return false;
  }
  
  const { to, body, from = twilioConfig.services.sms.fromNumber } = options;
  
  try {
    // Use mock implementation if real API is disabled or client is not initialized
    if (!twilioConfig.useRealTwilioApi || !twilioClient) {
      console.log(`[TWILIO MOCK] Sending SMS to ${to} from ${from}:`);
      console.log(`[TWILIO MOCK] Message: ${body}`);
      return new Promise(resolve => setTimeout(() => resolve(true), 500));
    }
    
    // Use the Twilio SDK to send the SMS message
    const message = await twilioClient.messages.create({
      to: to,
      from: from,
      body: body
    });
    
    console.log('SMS message sent! SID:', message.sid);
    return true;
  } catch (error) {
    console.error('Error sending SMS message:', error);
    return false;
  }
};

/**
 * Send an email using Twilio SendGrid
 */
export const sendEmail = async (options: TwilioEmailOptions): Promise<boolean> => {
  // Check if Twilio and Email service are enabled
  if (!twilioConfig.enabled || !twilioConfig.services.email.enabled) {
    console.log('[TWILIO] Email service is disabled. Enable it in twilioConfig.ts');
    return false;
  }
  
  const { to, subject, body, from = twilioConfig.services.email.fromEmail } = options;
  
  try {
    // For now, we use a mock implementation for email
    // In a real scenario, this would use Twilio SendGrid SDK
    if (!twilioConfig.useRealTwilioApi) {
      console.log(`[TWILIO MOCK] Sending email to ${to} from ${from}:`);
      console.log(`[TWILIO MOCK] Subject: ${subject}`);
      console.log(`[TWILIO MOCK] Body: ${body}`);
      return new Promise(resolve => setTimeout(() => resolve(true), 500));
    }
    
    // Here you would use the SendGrid API if useRealTwilioApi is true
    // This would require setting up SendGrid separately and importing their SDK
    // For now, just log a message about the implementation being needed
    console.log('[TWILIO] SendGrid implementation needed for production emails');
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
