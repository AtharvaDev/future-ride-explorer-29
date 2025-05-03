/**
 * SendGrid Client for sending emails using the SendGrid API
 */
import emailConfig, { SendGridConfig } from '@/config/emailConfig';
import sgMail from '@sendgrid/mail';

export interface SendGridMailOptions {
  from: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }> | {
    email: string;
    name?: string;
  };
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    content: string; // base64 encoded content
    filename: string;
    type: string;
    disposition: string;
  }>;
}

export class SendGridClient {
  constructor(config?: SendGridConfig) {
    // Use provided config or default to emailConfig
    const apiKey = config?.apiKey || emailConfig.sendgridConfig.apiKey;
    sgMail.setApiKey(apiKey); // This will now work correctly
    console.log('[SENDGRID CLIENT] Initialized');
  }

  async send(options: SendGridMailOptions): Promise<void> {
    try {
      // Handle to field being either an array or a single object
      const toField = Array.isArray(options.to) ? options.to : [options.to];

      // Construct SendGrid API payload
      const msg = {
        from: options.from,
        to: toField,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments
      };

      // Send email using SendGrid SDK
      const response = await sgMail.send(msg);
      console.log('[SENDGRID CLIENT] Email sent successfully', response);
    } catch (error) {
      console.error('[SENDGRID CLIENT] Error sending email via SendGrid:', error);
      throw error;
    }
  }
}
