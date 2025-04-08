
/**
 * Twilio Configuration File (Browser-Compatible)
 * 
 * This file contains all configuration settings for Twilio services.
 * In a browser environment, this will use mock services only.
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
  useRealTwilioApi: boolean; // Set to true to use an API proxy for Twilio
  services: {
    whatsapp: {
      enabled: boolean;
      fromNumber: string; // Should be in format: 'whatsapp:+1234567890'
    };
    sms: {
      enabled: boolean;
      fromNumber: string; // Should be in format: '+1234567890'
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
  
  // These credentials will only be used server-side, never in the browser
  accountSid: 'ACe6c3d650e8f823720ede94deb18ed903',
  authToken: 'c108c1ce858b84449c62370ebff94e22',

  // IMPORTANT: This must be false for browser-based apps unless you're using a proxy server
  useRealTwilioApi: false,
  
  services: {
    // WhatsApp configuration
    whatsapp: {
      enabled: true,
      fromNumber: 'whatsapp:+14155238886', // Default Twilio sandbox number
    },
    
    // SMS configuration
    sms: {
      enabled: false,
      fromNumber: '+15005550006', // Test phone number
    },
    
    // Email configuration (via SendGrid)
    email: {
      enabled: false,
      fromEmail: 'noreply@The Chauffeur Co..com',
    }
  }
};

export default twilioConfig;
