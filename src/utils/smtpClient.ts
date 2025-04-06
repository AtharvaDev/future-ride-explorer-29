
/**
 * SMTP Client for sending emails using Nodemailer
 */
import nodemailer from 'nodemailer';

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
  private transporter: nodemailer.Transporter;

  constructor(config: SmtpConfig) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendMail(options: MailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail(options);
      console.log('Email sent:', info.messageId);
    } catch (error) {
      console.error('Error sending email via SMTP:', error);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Failed to verify SMTP connection:', error);
      return false;
    }
  }
}
