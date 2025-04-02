
/**
 * Twilio Configuration File
 * 
 * This file contains all configuration settings for Twilio services.
 * Follow the steps below to enable and configure Twilio services:
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a Twilio account at https://www.twilio.com if you don't have one
 * 2. Get your Account SID and Auth Token from your Twilio dashboard
 * 3. For WhatsApp: Activate the WhatsApp sandbox in your Twilio console
 * 4. For SMS: Purchase a phone number from Twilio
 * 5. For Email: Set up SendGrid integration with Twilio
 * 6. Replace the placeholder values below with your actual credentials
 * 7. Set enabled to true for each service you want to activate
 */

export interface TwilioConfig {
  enabled: boolean;
  accountSid: string;
  authToken: string;
  useRealTwilioApi: boolean; // Set to true to make real API calls (requires CORS setup)
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
  
  // Your Twilio account credentials
  accountSid: 'ACe6c3d650e8f823720ede94deb18ed903', // Replace with your actual Account SID
  authToken: 'c108c1ce858b84449c62370ebff94e22',    // Replace with your actual Auth Token

  // IMPORTANT: Set to false for testing/development, true for production
  // Note: If true, you'll need to set up a proxy server for Twilio API calls to handle CORS
  useRealTwilioApi: false,
  
  services: {
    // WhatsApp configuration
    whatsapp: {
      enabled: true, // Set to true to enable WhatsApp notifications
      fromNumber: 'whatsapp:+14155238886', // Default Twilio sandbox number - replace with your WhatsApp-enabled number
    },
    
    // SMS configuration
    sms: {
      enabled: false, // Set to true to enable SMS notifications
      fromNumber: '+15005550006', // Replace with your Twilio phone number
    },
    
    // Email configuration (via SendGrid)
    email: {
      enabled: false, // Set to true to enable email notifications
      fromEmail: 'noreply@futureride.com', // Replace with your verified sender email
    }
  }
};

export default twilioConfig;
