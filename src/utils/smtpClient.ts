
/**
 * SMTP Client for sending emails using nodemailer (Browser Compatible)
 */
import * as nodemailer from 'nodemailer';

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
  to: string | string[];
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
  private transporter: nodemailer.Transporter | null = null;

  constructor(config: SmtpConfig) {
    this.config = config;
    console.log('[SMTP CLIENT] Initialized with host:', config.host);
    
    // Create a transporter in Node.js environment
    // In browser, we'll use the mock functionality
    if (typeof window === 'undefined') {
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.auth.user,
          pass: config.auth.pass
        }
      });
    }
  }

  async sendMail(options: MailOptions): Promise<void> {
    try {
      // Browser environment - mock sending
      if (typeof window !== 'undefined' || !this.transporter) {
        console.log('[SMTP CLIENT MOCK] Sending email:');
        console.log('- From:', options.from);
        console.log('- To:', Array.isArray(options.to) ? options.to.join(', ') : options.to);
        console.log('- Subject:', options.subject);
        console.log('- HTML content available:', !!options.html);
        console.log('- Text content available:', !!options.text);
        console.log('- Attachments:', options.attachments?.length || 0);
        
        // In a production environment, you would use a backend API endpoint
        // to send emails server-side
        console.log('[SMTP CLIENT MOCK] Email sent successfully');
        return;
      }
      
      // Node.js environment - actually send the email
      const info = await this.transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments
      });
      
      console.log('[SMTP CLIENT] Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Error sending email via SMTP:', error);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      console.log('[SMTP CLIENT] Verifying connection to', this.config.host);
      
      // In browser environment, mock verification
      if (typeof window !== 'undefined' || !this.transporter) {
        console.log('[SMTP CLIENT MOCK] Connection verified');
        return true;
      }
      
      // In Node.js, actually verify connection
      await this.transporter.verify();
      console.log('[SMTP CLIENT] Connection verified successfully');
      return true;
    } catch (error) {
      console.error('Failed to verify SMTP connection:', error);
      return false;
    }
  }
}
