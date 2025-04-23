
import { EmailConfig } from '@/config/notifications';
import { NotificationTemplateData } from './types';
import { templateEngine } from './templateEngine';
import { sendEmail } from '../twilioService';

export class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    console.log('[EMAIL SERVICE] Initialized with Twilio');
  }

  async sendBookingConfirmation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) {
      console.log('[EMAIL SERVICE] Email notifications disabled');
      return;
    }
    
    const subject = templateEngine.render(this.config.templates.bookingConfirmation.subject, data);
    const body = templateEngine.render(this.config.templates.bookingConfirmation.body, data);
    
    await this.sendNotification(to, subject, body);
  }

  async sendPaymentConfirmation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) {
      console.log('[EMAIL SERVICE] Email notifications disabled');
      return;
    }
    
    const subject = templateEngine.render(this.config.templates.paymentConfirmation.subject, data);
    const body = templateEngine.render(this.config.templates.paymentConfirmation.body, data);
    
    await this.sendNotification(to, subject, body);
  }

  async sendBookingReminder(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) {
      console.log('[EMAIL SERVICE] Email notifications disabled');
      return;
    }
    
    const subject = templateEngine.render(this.config.templates.bookingReminder.subject, data);
    const body = templateEngine.render(this.config.templates.bookingReminder.body, data);
    
    await this.sendNotification(to, subject, body);
  }

  async sendBookingCancellation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) {
      console.log('[EMAIL SERVICE] Email notifications disabled');
      return;
    }
    
    const subject = templateEngine.render(this.config.templates.bookingCancellation.subject, data);
    const body = templateEngine.render(this.config.templates.bookingCancellation.body, data);
    
    await this.sendNotification(to, subject, body);
  }

  private async sendNotification(to: string, subject: string, body: string): Promise<void> {
    try {
      await sendEmail({
        to: [to],
        subject,
        body,
      });
      console.log(`[EMAIL SERVICE] Email sent successfully to ${to}`);
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to send email:', error);
      throw new Error('Failed to send email notification');
    }
  }
}
