
/**
 * SendGrid Client for sending emails using the SendGrid API
 */

export interface SendGridMailOptions {
  from: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }>;
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

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(options: SendGridMailOptions): Promise<void> {
    try {
      // Construct SendGrid API payload
      const payload = {
        personalizations: [
          {
            to: options.to
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
        throw new Error(`SendGrid API error: ${response.status} ${response.statusText}`);
      }

      console.log('Email sent via SendGrid');
    } catch (error) {
      console.error('Error sending email via SendGrid:', error);
      throw error;
    }
  }
}
