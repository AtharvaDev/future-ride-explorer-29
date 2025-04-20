import { SmtpClient, MailOptions } from '@/utils/smtpClient';
import { EmailConfig } from '@/config/notifications';
import { NotificationTemplateData } from './types';
import { templateEngine } from './templateEngine';
import emailConfig from '@/config/emailConfig';

export class EmailService {
  private config: EmailConfig;
  private smtpClient: SmtpClient;

  constructor(config: EmailConfig) {
    this.config = config;
    
    // Initialize SMTP client with the configuration from emailConfig
    this.smtpClient = new SmtpClient();
    
    // Log initialization
    console.log('[EMAIL SERVICE] Initialized');
  }

  async sendBookingConfirmation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) {
      console.log('[EMAIL SERVICE] Email notifications disabled');
      return;
    }
    
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
    if (!this.config.enabled) {
      console.log('[EMAIL SERVICE] Email notifications disabled');
      return;
    }
    
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
    if (!this.config.enabled) {
      console.log('[EMAIL SERVICE] Email notifications disabled');
      return;
    }
    
    const subject = templateEngine.render(this.config.templates.bookingReminder.subject, data);
    const html = templateEngine.render(this.config.templates.bookingReminder.body, data);
    
    await this.sendEmail({
      to,
      subject,
      html
    });
  }

  async sendBookingCancellation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) {
      console.log('[EMAIL SERVICE] Email notifications disabled');
      return;
    }
    
    const subject = templateEngine.render(this.config.templates.bookingCancellation.subject, data);
    const html = templateEngine.render(this.config.templates.bookingCancellation.body, data);
    
    await this.sendEmail({
      to,
      subject,
      html
    });
  }

  async sendRefundConfirmation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) {
      console.log('[EMAIL SERVICE] Email notifications disabled');
      return;
    }
    
    const subject = this.config.templates.refundConfirmation.subject.replace(/{{(\w+)}}/g, (_, key) => String(data[key]));
    const html = this.config.templates.refundConfirmation.body.replace(/{{(\w+)}}/g, (_, key) => String(data[key]));
    
    await this.sendEmail({
      to,
      subject,
      html
    });

    // Admin notification
    if (this.config.adminNotifications?.refund) {
      await this.sendAdminNotification('Refund', data);
    }
  }

  private async sendEmail(options: { to: string, subject: string, html?: string, text?: string }): Promise<void> {
    try {
      const mailOptions: MailOptions = {
        from: `"${emailConfig.sender.name}" <${emailConfig.sender.email}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      };
      
      console.log(`[EMAIL SERVICE] Sending email to ${options.to} with subject: ${options.subject}`);
      await this.smtpClient.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to send email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  private async sendAdminNotification(type: string, data: NotificationTemplateData): Promise<void> {
    try {
      if (!this.config.adminNotifications) {
        console.warn('[EMAIL SERVICE] Admin notifications not configured');
        return;
      }
      
      // Format data for better readability
      const formattedData = Object.entries(data).map(([key, value]) => {
        return `<li><strong>${key}:</strong> ${value}</li>`;
      }).join('');
      
      await this.sendEmail({
        to: Array.isArray(emailConfig.adminEmails) ? 
             emailConfig.adminEmails.join(',') : 
             (emailConfig.adminEmails[0] || 'admin@example.com'),
        subject: `Admin Notification: ${type}`,
        html: `
          <h1>Admin Notification: ${type}</h1>
          <p>The following ${type.toLowerCase()} has been processed:</p>
          <ul>${formattedData}</ul>
        `
      });
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to send admin notification:', error);
      // Don't throw here to prevent client-facing errors
    }
  }
}
