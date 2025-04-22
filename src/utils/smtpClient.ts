
/**
 * SMTP Client for sending emails using nodemailer (Browser Compatible)
 * 
 * IMPORTANT: Emails only actually send in a Node.js server environment (local/prod).
 * In the browser (client), emails are just logged and NOT sent.
 * 
 * Never reference/import nodemailer except inside dynamic import in server code!
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
    // Never import or reference nodemailer here (browser-safe).
  }

  /**
   * Send an email using Nodemailer.
   * Only works in Node.js—browser is mock-only.
   */
  async sendMail(options: MailOptions): Promise<void> {
    // --- EARLY RETURN IF IN BROWSER: ---
    if (typeof window !== "undefined") {
      // MOCK: browser cannot send actual emails!
      console.log('[SMTP CLIENT MOCK] Sending email:');
      console.log('- From:', options.from);
      console.log('- To:', Array.isArray(options.to) ? options.to.join(', ') : options.to);
      console.log('- Subject:', options.subject);
      console.log('- HTML content:', !!options.html);
      console.log('- Text content:', !!options.text);
      console.log('- Attachments:', options.attachments?.length || 0);
      console.log('[SMTP CLIENT MOCK] Email send simulated');
      return;
    }

    // --- SERVER-SIDE ONLY: Nodemailer dynamic import ---
    try {
      if (!this.transporter) {
        /**
         * Critical: This dynamic import and createTransport CANNOT run on browser.
         * Avoids "Class extends value undefined" and all bundling problems.
         */
        // Use eval to fully avoid static analysis by bundlers like Vite/Webpack that pollute the browser bundle
        const nodemailer = await (eval('import("nodemailer")'));
        this.transporter = nodemailer.createTransport({
          host: this.config.host,
          port: this.config.port,
          secure: this.config.secure,
          auth: {
            user: this.config.auth.user,
            pass: this.config.auth.pass,
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
    } catch (err) {
      console.error('[SMTP CLIENT] Error sending email via SMTP:', err);
      throw err;
    }
  }

  /**
   * Verify SMTP connection (Node.js only).
   */
  async verifyConnection(): Promise<boolean> {
    if (typeof window !== "undefined") {
      console.log('[SMTP CLIENT MOCK] Connection verified');
      return true;
    }
    try {
      if (!this.transporter) {
        const nodemailer = await (eval('import("nodemailer")'));
        this.transporter = nodemailer.createTransport({
          host: this.config.host,
          port: this.config.port,
          secure: this.config.secure,
          auth: {
            user: this.config.auth.user,
            pass: this.config.auth.pass,
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
