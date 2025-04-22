
/**
 * SMTP Client for sending emails using nodemailer (Browser Compatible)
 */
import emailConfig, { SmtpConfig } from '@/config/emailConfig';

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
  private transporter: any | null = null; // Type is any to avoid compile-time dependency on nodemailer

  constructor(config?: SmtpConfig) {
    // Use provided config or default to emailConfig
    this.config = config || emailConfig.smtpConfig;

    console.log('[SMTP CLIENT] Initialized with host:', this.config.host);

    // We don't instantiate transporter here since nodemailer is only imported on demand in Node.js
  }

  async sendMail(options: MailOptions): Promise<void> {
    try {
      // Browser environment - mock sending
      if (typeof window !== 'undefined') {
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

      // Dynamically import nodemailer only in Node.js/server environment
      if (!this.transporter) {
        const nodemailer = await import('nodemailer');
        this.transporter = nodemailer.createTransport({
          host: this.config.host,
          port: this.config.port,
          secure: this.config.secure,
          auth: {
            user: this.config.auth.user,
            pass: this.config.auth.pass
          }
        });
      }

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
      if (typeof window !== 'undefined') {
        console.log('[SMTP CLIENT MOCK] Connection verified');
        return true;
      }

      // Dynamically import nodemailer only in Node.js/server environment
      if (!this.transporter) {
        const nodemailer = await import('nodemailer');
        this.transporter = nodemailer.createTransport({
          host: this.config.host,
          port: this.config.port,
          secure: this.config.secure,
          auth: {
            user: this.config.auth.user,
            pass: this.config.auth.pass
          }
        });
      }

      await this.transporter.verify();
      console.log('[SMTP CLIENT] Connection verified successfully');
      return true;
    } catch (error) {
      console.error('Failed to verify SMTP connection:', error);
      return false;
    }
  }
}
