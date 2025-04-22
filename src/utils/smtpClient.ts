
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
  private transporter: any | null = null;

  constructor(config?: SmtpConfig) {
    this.config = config || emailConfig.smtpConfig;

    console.log('[SMTP CLIENT] Initialized with host:', this.config.host);

    // Never reference nodemailer here!
    // Transporter will be initialized server-side only, later.
  }

  async sendMail(options: MailOptions): Promise<void> {
    // Always branch out browser environment early, before any nodemailer reference!
    if (typeof window !== 'undefined') {
      // MOCK: browser cannot send real emails. Log intent instead!
      console.log('[SMTP CLIENT MOCK] Sending email:');
      console.log('- From:', options.from);
      console.log('- To:', Array.isArray(options.to) ? options.to.join(', ') : options.to);
      console.log('- Subject:', options.subject);
      console.log('- HTML content available:', !!options.html);
      console.log('- Text content available:', !!options.text);
      console.log('- Attachments:', options.attachments?.length || 0);
      console.log('[SMTP CLIENT MOCK] Email sent successfully');
      return;
    }
    // Node.js/server only: dynamically import nodemailer
    try {
      if (!this.transporter) {
        // Dynamic import is only called in pure Node.js
        const nodemailer = await eval('import("nodemailer")');
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
    if (typeof window !== 'undefined') {
      console.log('[SMTP CLIENT MOCK] Connection verified');
      return true;
    }
    try {
      if (!this.transporter) {
        // Dynamic import kept completely away from browser
        const nodemailer = await eval('import("nodemailer")');
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

