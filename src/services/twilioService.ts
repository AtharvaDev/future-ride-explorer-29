
// Twilio Service Implementation
// This file contains mock implementations of Twilio services
// Replace with actual Twilio SDK integration when ready for production
import twilio from 'twilio'; // Replace require with import

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
    
    // In a real implementation, this would use the Twilio SDK
    console.log(`[TWILIO MOCK] Sending WhatsApp message to ${formattedTo} from ${from}:`);
    console.log(`[TWILIO MOCK] Message: ${body}`);
    
    // In a real implementation, you would use something like:
    
    const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);
    const message = await client.messages.create({
      body: body,
      from: from,
      to: formattedTo
    });
    console.log('Message SID:', message.sid);
    // create a success
    
    // Return success after simulating API delay
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
};

/**
 * Send an SMS message using Twilio
 * This is a mock implementation that logs the message and returns a promise
 */
export const sendSmsMessage = async (options: TwilioMessageOptions): Promise<boolean> => {
  // Check if Twilio and SMS service are enabled
  if (!twilioConfig.enabled || !twilioConfig.services.sms.enabled) {
    console.log('[TWILIO] SMS service is disabled. Enable it in twilioConfig.ts');
    return false;
  }
  
  const { to, body, from = twilioConfig.services.sms.fromNumber } = options;
  
  try {
    // In a real implementation, this would use the Twilio SDK
    console.log(`[TWILIO MOCK] Sending SMS to ${to} from ${from}:`);
    console.log(`[TWILIO MOCK] Message: ${body}`);
    
    // Return success after simulating API delay
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  } catch (error) {
    console.error('Error sending SMS message:', error);
    return false;
  }
};

/**
 * Send an email using Twilio SendGrid
 * This is a mock implementation that logs the email and returns a promise
 */
export const sendEmail = async (options: TwilioEmailOptions): Promise<boolean> => {
  // Check if Twilio and Email service are enabled
  if (!twilioConfig.enabled || !twilioConfig.services.email.enabled) {
    console.log('[TWILIO] Email service is disabled. Enable it in twilioConfig.ts');
    return false;
  }
  
  const { to, subject, body, from = twilioConfig.services.email.fromEmail } = options;
  
  try {
    // In a real implementation, this would use the SendGrid SDK
    console.log(`[TWILIO MOCK] Sending email to ${to} from ${from}:`);
    console.log(`[TWILIO MOCK] Subject: ${subject}`);
    console.log(`[TWILIO MOCK] Body: ${body}`);
    
    // Return success after simulating API delay
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
