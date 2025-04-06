
// Twilio Service and Email Service Implementation
import { Twilio } from 'twilio';
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
    // Use mock implementation if testing mode is enabled
    if (!twilioConfig.useRealTwilioApi) {
      console.log(`[EMAIL MOCK] Sending email to ${to.join(', ')} from ${from.name} <${from.email}>:`);
      console.log(`[EMAIL MOCK] Subject: ${subject}`);
      console.log(`[EMAIL MOCK] Body: ${body}`);
      console.log(`[EMAIL MOCK] Attachments: ${attachments.length}`);
      return new Promise(resolve => setTimeout(() => resolve(true), 500));
    }

    // Choose the email provider based on configuration
    const provider: EmailProvider = emailConfig.provider;
    
    if (provider === 'nodemailer') {
      // Use Nodemailer with Gmail
      const smtpClient = new SmtpClient(emailConfig.nodemailerConfig);
      await smtpClient.sendMail({
        from: `"${from.name}" <${from.email}>`,
        to: to.join(', '),
        subject,
        html: body,
        attachments
      });
      console.log(`Email sent via Nodemailer to ${to.join(', ')}`);
    } else if (provider === 'sendgrid') {
      // Use SendGrid
      const sendGridClient = new SendGridClient(emailConfig.sendgridConfig.apiKey);
      await sendGridClient.send({
        from: { name: from.name, email: from.email },
        to: to.map(email => ({ email })),
        subject,
        html: body,
        attachments: attachments.map(attachment => ({
          content: attachment.content.toString('base64'),
          filename: attachment.filename,
          type: attachment.contentType || 'application/octet-stream',
          disposition: 'attachment'
        }))
      });
      console.log(`Email sent via SendGrid to ${to.join(', ')}`);
    } else {
      throw new Error(`Unsupported email provider: ${provider}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error sending email via ${emailConfig.provider}:`, error);
    return false;
  }
};
