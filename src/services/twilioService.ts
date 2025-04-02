
// Twilio Service Implementation
// This file contains mock implementations of Twilio services
// Replace with actual Twilio SDK integration when ready for production

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
 * This is a mock implementation that logs the message and returns a promise
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
    
    // In a real implementation, we would use the Twilio SDK
    console.log(`[TWILIO MOCK] Sending WhatsApp message to ${formattedTo} from ${from}:`);
    console.log(`[TWILIO MOCK] Message: ${body}`);
    
    // Real implementation would use Twilio's REST API with fetch instead of require
    if (twilioConfig.useRealTwilioApi) {
      // Use fetch API for browser environments instead of require
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioConfig.accountSid}/Messages.json`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${twilioConfig.accountSid}:${twilioConfig.authToken}`)}`
        },
        body: new URLSearchParams({
          To: formattedTo,
          From: from,
          Body: body
        })
      });
      
      const data = await response.json();
      console.log('Message SID:', data.sid);
    }
    
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
    
    // Real implementation with fetch API if enabled
    if (twilioConfig.useRealTwilioApi) {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioConfig.accountSid}/Messages.json`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${twilioConfig.accountSid}:${twilioConfig.authToken}`)}`
        },
        body: new URLSearchParams({
          To: to,
          From: from,
          Body: body
        })
      });
      
      const data = await response.json();
      console.log('Message SID:', data.sid);
    }
    
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
