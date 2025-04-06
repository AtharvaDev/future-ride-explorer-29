
/**
 * SMTP Client for sending emails (Browser Compatible Mock)
 */

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class SmtpClient {
  private config: SmtpConfig;

  constructor(config: SmtpConfig) {
    this.config = config;
    console.log('[SMTP CLIENT] Initialized with host:', config.host);
  }

  async sendMail(options: MailOptions): Promise<void> {
    try {
      console.log('[SMTP CLIENT MOCK] Sending email:');
      console.log('- From:', options.from);
      console.log('- To:', options.to);
      console.log('- Subject:', options.subject);
      console.log('- HTML content available:', !!options.html);
      console.log('- Text content available:', !!options.text);
      console.log('- Attachments:', options.attachments?.length || 0);
      
      // In a production environment, you would use a backend API endpoint
      // to send emails server-side

      console.log('[SMTP CLIENT MOCK] Email sent successfully');
    } catch (error) {
      console.error('Error sending email via SMTP:', error);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      console.log('[SMTP CLIENT MOCK] Verifying connection to', this.config.host);
      // Always return success in mock mode
      return true;
    } catch (error) {
      console.error('Failed to verify SMTP connection:', error);
      return false;
    }
  }
}
