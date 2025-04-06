
/**
 * Email Notification Configuration
 * 
 * This file contains all settings related to email notifications.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Make sure Twilio SendGrid is properly configured in twilioConfig.ts
 * 2. Set enabled to true to activate email notifications
 * 3. Configure your templates and admin notification preferences
 */

import { UI_STRINGS } from '@/constants/uiStrings';

export interface EmailConfig {
  enabled: boolean;
  templates: {
    bookingConfirmation: {
      subject: string;
      body: string;
    };
    paymentConfirmation: {
      subject: string;
      body: string;
    };
    bookingReminder: {
      subject: string;
      body: string;
    };
    bookingCancellation: {
      subject: string;
      body: string;
    };
  };
  sender: {
    name: string;
    email: string;
  };
  adminNotifications?: {
    bookingConfirmation: boolean;
    paymentConfirmation: boolean;
    userSignup: boolean;
    profileUpdate: boolean;
    bookingAttempt: boolean;
  };
}

const emailConfig: EmailConfig = {
  enabled: true,
  templates: {
    bookingConfirmation: {
      subject: UI_STRINGS.NOTIFICATIONS.EMAIL.BOOKING_CONFIRMATION.SUBJECT,
      body: UI_STRINGS.NOTIFICATIONS.EMAIL.BOOKING_CONFIRMATION.BODY
    },
    paymentConfirmation: {
      subject: UI_STRINGS.NOTIFICATIONS.EMAIL.PAYMENT_CONFIRMATION.SUBJECT,
      body: UI_STRINGS.NOTIFICATIONS.EMAIL.PAYMENT_CONFIRMATION.BODY
    },
    bookingReminder: {
      subject: UI_STRINGS.NOTIFICATIONS.EMAIL.BOOKING_REMINDER.SUBJECT,
      body: UI_STRINGS.NOTIFICATIONS.EMAIL.BOOKING_REMINDER.BODY
    },
    bookingCancellation: {
      subject: UI_STRINGS.NOTIFICATIONS.EMAIL.BOOKING_CANCELLATION.SUBJECT,
      body: UI_STRINGS.NOTIFICATIONS.EMAIL.BOOKING_CANCELLATION.BODY
    }
  },
  sender: {
    name: UI_STRINGS.COMPANY.NAME + " " + UI_STRINGS.COMPANY.CUSTOMER_SERVICE,
    email: UI_STRINGS.COMPANY.EMAIL
  },
  adminNotifications: {
    bookingConfirmation: true,
    paymentConfirmation: true,
    userSignup: true,
    profileUpdate: true,
    bookingAttempt: true
  }
};

export default emailConfig;
