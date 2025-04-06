
import { EmailConfig, WhatsAppConfig } from '@/config/notifications';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface WhatsAppMessageOptions {
  to: string;
  body: string;
}

export interface NotificationTemplateData {
  [key: string]: string | number;
}

export interface TemplateEngine {
  render(template: string, data: NotificationTemplateData): string;
}
