
/**
 * Twilio Configuration File
 * 
 * This file contains all configuration settings for Twilio services.
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a Twilio account at https://www.twilio.com if you don't have one
 * 2. Configure your backend API to handle the actual Twilio API calls
 * 3. For WhatsApp: Activate the WhatsApp sandbox in your Twilio console
 * 4. For SMS: Purchase a phone number from Twilio
 * 5. For Email: Set up SendGrid integration with Twilio
 * 6. Update the phone numbers and settings below
 * 7. Set enabled to true for each service you want to activate
 */

export interface TwilioConfig {
  enabled: boolean;
  accountSid: string;
  authToken: string;
  useRealTwilioApi: boolean;
  services: {
    whatsapp: {
      enabled: boolean;
      fromNumber: string;
    };
    sms: {
      enabled: boolean;
      fromNumber: string;
    };
    email: {
      enabled: boolean;
      fromEmail: string;
    };
  };
}

const twilioConfig: TwilioConfig = {
  // Master switch for all Twilio services
  enabled: true,
  
  // Twilio credentials (only used server-side)
  accountSid: 'ACe6c3d650e8f823720ede94deb18ed903',
  authToken: 'c108c1ce858b84449c62370ebff94e22',

  // Set to true only if using a proxy server
  useRealTwilioApi: false,
  
  services: {
    whatsapp: {
      enabled: true,
      fromNumber: 'whatsapp:+14155238886',
    },
    sms: {
      enabled: false,
      fromNumber: '+15005550006',
    },
    email: {
      enabled: true,
      fromEmail: 'notifications@thechaufeurco.com',
    }
  }
};

export default twilioConfig;
