
import { SmtpClient } from '@/utils/smtpClient';
import { EmailConfig } from '@/config/notifications';
import { EmailOptions, NotificationTemplateData } from './types';
import { templateEngine } from './templateEngine';
import { UI_STRINGS } from '@/constants/uiStrings';

export class EmailService {
  private config: EmailConfig;
  private smtpClient: SmtpClient;

  constructor(config: EmailConfig) {
    this.config = config;
    this.smtpClient = new SmtpClient({
      host: 'smtp.example.com', // This would normally come from env variables
      port: 587,
      secure: false,
      auth: {
        user: 'username', // This would normally come from env variables
        pass: 'password'  // This would normally come from env variables
      }
    });
  }

  async sendBookingConfirmation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) return;
    
    const subject = templateEngine.render(this.config.templates.bookingConfirmation.subject, data);
    const html = templateEngine.render(this.config.templates.bookingConfirmation.body, data);
    
    await this.sendEmail({
      to,
      subject,
      html
    });
    
    // Send admin notification if enabled
    if (this.config.adminNotifications?.bookingConfirmation) {
      await this.sendAdminNotification('Booking Confirmation', data);
    }
  }

  async sendPaymentConfirmation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) return;
    
    const subject = templateEngine.render(this.config.templates.paymentConfirmation.subject, data);
    const html = templateEngine.render(this.config.templates.paymentConfirmation.body, data);
    
    await this.sendEmail({
      to,
      subject,
      html
    });
    
    // Send admin notification if enabled
    if (this.config.adminNotifications?.paymentConfirmation) {
      await this.sendAdminNotification('Payment Confirmation', data);
    }
  }

  async sendBookingReminder(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) return;
    
    const subject = templateEngine.render(this.config.templates.bookingReminder.subject, data);
    const html = templateEngine.render(this.config.templates.bookingReminder.body, data);
    
    await this.sendEmail({
      to,
      subject,
      html
    });
  }

  async sendBookingCancellation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) return;
    
    const subject = templateEngine.render(this.config.templates.bookingCancellation.subject, data);
    const html = templateEngine.render(this.config.templates.bookingCancellation.body, data);
    
    await this.sendEmail({
      to,
      subject,
      html
    });
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.smtpClient.sendMail({
        from: `"${this.config.sender.name}" <${this.config.sender.email}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  private async sendAdminNotification(type: string, data: NotificationTemplateData): Promise<void> {
    try {
      const adminEmail = UI_STRINGS.COMPANY.ADMIN_EMAIL;
      
      if (!adminEmail) {
        console.warn('Admin email not configured for notifications');
        return;
      }
      
      await this.sendEmail({
        to: adminEmail,
        subject: `Admin Notification: ${type}`,
        html: `
          <h1>Admin Notification: ${type}</h1>
          <p>The following ${type.toLowerCase()} has been processed:</p>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        `
      });
    } catch (error) {
      console.error('Failed to send admin notification:', error);
    }
  }
}
