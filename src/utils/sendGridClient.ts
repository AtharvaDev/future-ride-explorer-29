
/**
 * SendGrid Client for sending emails using the SendGrid API
 */

export interface SendGridConfig {
  apiKey: string;
}

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
  private apiKey: string;

  constructor(config: SendGridConfig) {
    this.apiKey = config.apiKey;
    console.log('[SENDGRID CLIENT] Initialized');
  }

  async send(options: SendGridMailOptions): Promise<void> {
    try {
      // Handle to field being either an array or a single object
      const toField = Array.isArray(options.to) ? options.to : [options.to];
      
      // Construct SendGrid API payload
      const payload = {
        personalizations: [
          {
            to: toField
          }
        ],
        from: options.from,
        subject: options.subject,
        content: [
          {
            type: 'text/html',
            value: options.html || ''
          }
        ],
        attachments: options.attachments || []
      };

      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        console.log('[SENDGRID CLIENT MOCK] Would send email:');
        console.log('- From:', `${options.from.name} <${options.from.email}>`);
        console.log('- To:', toField.map(t => t.email).join(', '));
        console.log('- Subject:', options.subject);
        console.log('- Payload:', JSON.stringify(payload, null, 2));
        console.log('[SENDGRID CLIENT MOCK] Email sent successfully');
        return;
      }

      // Make API request to SendGrid
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SendGrid API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      console.log('[SENDGRID CLIENT] Email sent successfully');
    } catch (error) {
      console.error('[SENDGRID CLIENT] Error sending email via SendGrid:', error);
      throw error;
    }
  }
}
