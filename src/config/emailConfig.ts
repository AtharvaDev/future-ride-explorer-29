/**
 * Email Notification Configuration
 * 
 * This file contains all settings related to email notifications.
 * 
 * SETUP INSTRUCTIONS:
 * 1. For development with Gmail:
 *    - Set provider to 'nodemailer'
 *    - Create an App Password in your Google account:
 *      a. Go to your Google Account > Security
 *      b. Under "Signing in to Google," select 2-Step Verification
 *      c. At the bottom, select App passwords
 *      d. Select "Mail" as the app and your device
 *      e. Copy the generated password
 *    - Use your Gmail address and the generated App Password in smtpConfig
 *
 * 2. For production with SendGrid:
 *    - Set provider to 'sendgrid'
 *    - Sign up for SendGrid (sendgrid.com)
 *    - Create an API Key in your SendGrid dashboard
 *    - Add your SendGrid API key in sendgridConfig
 *    - Verify your sender email in SendGrid
 * 
 * 3. Configure notification types to enable/disable specific notifications
 */

import { UI_STRINGS } from '@/constants/uiStrings';
import { COMPANY_STRINGS } from '@/constants/strings/companyStrings';

export type EmailProvider = 'sendgrid';
export type NotificationType =
  | 'bookingConfirmation'
  | 'paymentConfirmation'
  | 'bookingReminder'
  | 'bookingCancellation'
  | 'refundConfirmation'
  | 'userLoginOrSignUp'
  | 'profileUpdate'
  | 'bookingAttempt'
  | 'refund';

export interface SendGridConfig {
  apiKey: string;
}

export interface EmailConfig {
  enabled: boolean;
  provider: EmailProvider;
  sendgridConfig: SendGridConfig;
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
    refundConfirmation: {
      subject: string;
      body: string;
    };
  };
  sender: {
    name: string;
    email: string;
  };
  userNotifications: {
    [key in NotificationType]?: boolean;
  };
  adminNotifications: {
    [key in NotificationType]?: boolean;
  };
  adminEmails: string[];
}

const emailConfig: EmailConfig = {
  enabled: true,
  provider: 'sendgrid',
  
  // Configuration for SendGrid
  sendgridConfig: {
    apiKey: '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'
  },
  
  templates: {
    refundConfirmation: {
      subject: "Your The Chauffeur Co. Refund Confirmation - {{bookingId}}",
      body: `
        <h1>Refund Confirmation</h1>
        <p>Dear {{name}},</p>
        <p>Your refund for booking ID {{bookingId}} has been processed successfully.</p>
        <p>Refund Amount: ₹{{refundAmount}}</p>
        <p>If you have any questions, please contact our support team.</p>
      `
    },
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
    name: COMPANY_STRINGS.NAME + " " + COMPANY_STRINGS.CUSTOMER_SERVICE,
    email: COMPANY_STRINGS.EMAIL
  },
  
  userNotifications: {
    bookingConfirmation: true,
    bookingReminder: true,
    bookingCancellation: true,
    refundConfirmation: true,
    paymentConfirmation: true
  },
  
  adminNotifications: {
    bookingConfirmation: true,
    userLoginOrSignUp: true,
    profileUpdate: true,
    bookingAttempt: true,
    refund: true
  },
  
  adminEmails: [COMPANY_STRINGS.ADMIN_EMAIL, 'workwithatharva@gmail.com']
};

export default emailConfig;
