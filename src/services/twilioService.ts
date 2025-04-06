
// Twilio Service and Email Service Implementation
import twilioConfig from '@/config/twilioConfig';
import emailConfig, { EmailProvider } from '@/config/emailConfig';
import { SmtpClient } from '@/utils/smtpClient';
import { SendGridClient } from '@/utils/sendGridClient';

interface TwilioMessageOptions {
  to: string;
  body: string;
  from?: string;
}

interface EmailOptions {
  to: string[];
  subject: string;
  body: string;
  from?: {
    name: string;
    email: string;
  };
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * Send a WhatsApp message using Twilio or mock service
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
    
    // Always use mock implementation in browser environment
    console.log(`[TWILIO MOCK] Sending WhatsApp message to ${formattedTo} from ${from}:`);
    console.log(`[TWILIO MOCK] Message: ${body}`);
    
    // In a real-world scenario, you would use a backend API endpoint here
    // that would handle the Twilio API call server-side
    
    console.log('WhatsApp message sent via mock service!');
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
};

/**
 * Send an SMS message using Twilio or mock service
 */
export const sendSmsMessage = async (options: TwilioMessageOptions): Promise<boolean> => {
  // Check if Twilio and SMS service are enabled
  if (!twilioConfig.enabled || !twilioConfig.services.sms.enabled) {
    console.log('[TWILIO] SMS service is disabled. Enable it in twilioConfig.ts');
    return false;
  }
  
  const { to, body, from = twilioConfig.services.sms.fromNumber } = options;
  
  try {
    // Always use mock implementation in browser environment
    console.log(`[TWILIO MOCK] Sending SMS to ${to} from ${from}:`);
    console.log(`[TWILIO MOCK] Message: ${body}`);
    
    // In a real-world scenario, you would use a backend API endpoint here
    // that would handle the Twilio API call server-side
    
    console.log('SMS message sent via mock service!');
    return true;
  } catch (error) {
    console.error('Error sending SMS message:', error);
    return false;
  }
};

/**
 * Send an email using the configured provider (Nodemailer or SendGrid)
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  // Check if email service is enabled
  if (!emailConfig.enabled) {
    console.log('[EMAIL] Email service is disabled. Enable it in emailConfig.ts');
    return false;
  }
  
  const { to, subject, body, from = { name: emailConfig.sender.name, email: emailConfig.sender.email }, attachments = [] } = options;
  
  try {
    // Use mock implementation in browser environment
    console.log(`[EMAIL MOCK] Sending email to ${to.join(', ')} from ${from.name} <${from.email}>:`);
    console.log(`[EMAIL MOCK] Subject: ${subject}`);
    console.log(`[EMAIL MOCK] Body: ${body}`);
    console.log(`[EMAIL MOCK] Attachments: ${attachments.length}`);
    
    // In a real-world scenario, you would use a backend API endpoint here
    // that would handle the email sending via appropriate provider
    
    return true;
  } catch (error) {
    console.error(`Error sending email via ${emailConfig.provider}:`, error);
    return false;
  }
};
