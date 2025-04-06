
/**
 * WhatsApp Notification Configuration
 * 
 * This file contains all settings related to WhatsApp messaging.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Make sure Twilio is properly configured in twilioConfig.ts
 * 2. Set enabled to true to activate WhatsApp notifications
 * 3. Configure your templates and admin notification preferences
 */

import { UI_STRINGS } from '@/constants/uiStrings';

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
  adminNotifications?: {
    bookingConfirmation: boolean;
    paymentConfirmation: boolean;
    userSignup: boolean;
    profileUpdate: boolean;
    bookingAttempt: boolean;
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
  adminNotifications: {
    bookingConfirmation: true,
    paymentConfirmation: true,
    userSignup: true,
    profileUpdate: true,
    bookingAttempt: true
  }
};

export default whatsAppConfig;
