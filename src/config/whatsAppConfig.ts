
/**
 * WhatsApp Notification Configuration
 * 
 * This file contains all settings related to WhatsApp messaging.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Make sure Twilio is properly configured in twilioConfig.ts
 * 2. Set enabled to true to activate WhatsApp notifications
 * 3. Configure which notifications should be sent to users and admins
 * 4. Make sure your WhatsApp Business account is verified if using in production
 */

import { UI_STRINGS } from '@/constants/uiStrings';

export type NotificationType = 'bookingConfirmation' | 'paymentConfirmation' | 'bookingReminder' | 'bookingCancellation' | 'userSignup' | 'profileUpdate' | 'bookingAttempt';

export interface WhatsAppConfig {
  enabled: boolean;
  templates: {
    bookingConfirmation: string;
    paymentConfirmation: string;
    bookingReminder: string;
    bookingCancellation: string;
  };
  sender: {
    phone: string;
    businessName: string;
  };
  adminNumber: string;
  userNotifications: {
    [key in NotificationType]?: boolean;
  };
  adminNotifications: {
    [key in NotificationType]?: boolean;
  };
}

const whatsAppConfig: WhatsAppConfig = {
  enabled: true,
  templates: {
    bookingConfirmation: UI_STRINGS.NOTIFICATIONS.WHATSAPP.BOOKING_CONFIRMATION,
    paymentConfirmation: UI_STRINGS.NOTIFICATIONS.WHATSAPP.PAYMENT_CONFIRMATION,
    bookingReminder: UI_STRINGS.NOTIFICATIONS.WHATSAPP.BOOKING_REMINDER,
    bookingCancellation: UI_STRINGS.NOTIFICATIONS.WHATSAPP.BOOKING_CANCELLATION
  },
  sender: {
    phone: "+918850414839",
    businessName: UI_STRINGS.COMPANY.NAME
  },
  adminNumber: "whatsapp:+918850414839", // Admin's WhatsApp number with proper format
  
  // Control which notifications are sent to users
  userNotifications: {
    bookingConfirmation: true,
    paymentConfirmation: true,
    bookingReminder: true,
    bookingCancellation: true
  },
  
  // Control which notifications are sent to admins
  adminNotifications: {
    bookingConfirmation: true,
    paymentConfirmation: true,
    userSignup: true,
    profileUpdate: false,
    bookingAttempt: true
  }
};

export default whatsAppConfig;
