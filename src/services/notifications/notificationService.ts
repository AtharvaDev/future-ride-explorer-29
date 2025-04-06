
import { EmailService } from './emailService';
import { WhatsAppService } from './whatsappService';
import { emailConfig, whatsAppConfig } from '@/config/notifications';
import { NotificationTemplateData } from './types';

export class NotificationService {
  private emailService: EmailService;
  private whatsAppService: WhatsAppService;

  constructor() {
    this.emailService = new EmailService(emailConfig);
    this.whatsAppService = new WhatsAppService(whatsAppConfig);
  }

  async sendBookingConfirmation(
    email: string, 
    phone: string, 
    data: NotificationTemplateData
  ): Promise<void> {
    const promises: Promise<void>[] = [];
    
    // Send email notification
    promises.push(
      this.emailService.sendBookingConfirmation(email, data)
        .catch(error => {
          console.error('Email booking confirmation failed:', error);
          return Promise.resolve();
        })
    );
    
    // Send WhatsApp notification
    if (phone) {
      promises.push(
        this.whatsAppService.sendBookingConfirmation(phone, data)
          .catch(error => {
            console.error('WhatsApp booking confirmation failed:', error);
            return Promise.resolve();
          })
      );
    }
    
    await Promise.all(promises);
  }

  async sendPaymentConfirmation(
    email: string, 
    phone: string, 
    data: NotificationTemplateData
  ): Promise<void> {
    const promises: Promise<void>[] = [];
    
    // Send email notification
    promises.push(
      this.emailService.sendPaymentConfirmation(email, data)
        .catch(error => {
          console.error('Email payment confirmation failed:', error);
          return Promise.resolve();
        })
    );
    
    // Send WhatsApp notification
    if (phone) {
      promises.push(
        this.whatsAppService.sendPaymentConfirmation(phone, data)
          .catch(error => {
            console.error('WhatsApp payment confirmation failed:', error);
            return Promise.resolve();
          })
      );
    }
    
    await Promise.all(promises);
  }

  async sendBookingReminder(
    email: string, 
    phone: string, 
    data: NotificationTemplateData
  ): Promise<void> {
    const promises: Promise<void>[] = [];
    
    // Send email notification
    promises.push(
      this.emailService.sendBookingReminder(email, data)
        .catch(error => {
          console.error('Email booking reminder failed:', error);
          return Promise.resolve();
        })
    );
    
    // Send WhatsApp notification
    if (phone) {
      promises.push(
        this.whatsAppService.sendBookingReminder(phone, data)
          .catch(error => {
            console.error('WhatsApp booking reminder failed:', error);
            return Promise.resolve();
          })
      );
    }
    
    await Promise.all(promises);
  }

  async sendBookingCancellation(
    email: string, 
    phone: string, 
    data: NotificationTemplateData
  ): Promise<void> {
    const promises: Promise<void>[] = [];
    
    // Send email notification
    promises.push(
      this.emailService.sendBookingCancellation(email, data)
        .catch(error => {
          console.error('Email booking cancellation failed:', error);
          return Promise.resolve();
        })
    );
    
    // Send WhatsApp notification
    if (phone) {
      promises.push(
        this.whatsAppService.sendBookingCancellation(phone, data)
          .catch(error => {
            console.error('WhatsApp booking cancellation failed:', error);
            return Promise.resolve();
          })
      );
    }
    
    await Promise.all(promises);
  }
}

export const notificationService = new NotificationService();
