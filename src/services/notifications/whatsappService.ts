
import { WhatsAppConfig } from '@/config/notifications';
import { NotificationTemplateData, WhatsAppMessageOptions } from './types';
import { templateEngine } from './templateEngine';
import { UI_STRINGS } from '@/constants/uiStrings';

export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor(config: WhatsAppConfig) {
    this.config = config;
  }

  async sendBookingConfirmation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) return;
    
    const body = templateEngine.render(this.config.templates.bookingConfirmation, data);
    
    await this.sendWhatsAppMessage({
      to,
      body
    });
    
    // Send admin notification if enabled
    if (this.config.adminNotifications?.bookingConfirmation) {
      await this.sendAdminNotification('Booking Confirmation', data);
    }
  }

  async sendPaymentConfirmation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) return;
    
    const body = templateEngine.render(this.config.templates.paymentConfirmation, data);
    
    await this.sendWhatsAppMessage({
      to,
      body
    });
    
    // Send admin notification if enabled
    if (this.config.adminNotifications?.paymentConfirmation) {
      await this.sendAdminNotification('Payment Confirmation', data);
    }
  }

  async sendBookingReminder(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) return;
    
    const body = templateEngine.render(this.config.templates.bookingReminder, data);
    
    await this.sendWhatsAppMessage({
      to,
      body
    });
  }

  async sendBookingCancellation(to: string, data: NotificationTemplateData): Promise<void> {
    if (!this.config.enabled) return;
    
    const body = templateEngine.render(this.config.templates.bookingCancellation, data);
    
    await this.sendWhatsAppMessage({
      to,
      body
    });
  }

  private async sendWhatsAppMessage(options: WhatsAppMessageOptions): Promise<void> {
    try {
      // In a real implementation, this would use the Twilio API
      // Since we're using a browser-compatible mock, we'll just log the message
      console.log('[WHATSAPP MOCK] Sending message:');
      console.log('- To:', options.to);
      console.log('- Body:', options.body);
      console.log('[WHATSAPP MOCK] Message sent successfully');
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      throw new Error('Failed to send WhatsApp notification');
    }
  }

  private async sendAdminNotification(type: string, data: NotificationTemplateData): Promise<void> {
    try {
      if (!this.config.adminNumber) {
        console.warn('Admin WhatsApp number not configured for notifications');
        return;
      }
      
      await this.sendWhatsAppMessage({
        to: this.config.adminNumber,
        body: `🔔 *Admin Notification: ${type}*\n\nThe following ${type.toLowerCase()} has been processed:\n\n${JSON.stringify(data, null, 2)}`
      });
    } catch (error) {
      console.error('Failed to send admin WhatsApp notification:', error);
    }
  }
}
