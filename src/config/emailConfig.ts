
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
 *    - Use your Gmail address and the generated App Password in nodemailerConfig
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

export type EmailProvider = 'nodemailer' | 'sendgrid';
export type NotificationType = 'bookingConfirmation' | 'paymentConfirmation' | 'bookingReminder' | 'bookingCancellation' | 'userSignup' | 'profileUpdate' | 'bookingAttempt';

export interface EmailConfig {
  enabled: boolean;
  provider: EmailProvider;
  nodemailerConfig: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    }
  };
  sendgridConfig: {
    apiKey: string;
  };
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
  
  // Change to 'sendgrid' for production
  provider: 'nodemailer',
  
  // Configuration for Nodemailer with Gmail (development/testing)
  nodemailerConfig: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'thechauffeurco.india@gmail.com', // Your Gmail address
      pass: 'nfaf qywe scmm pdab'     // Your Gmail app password
    }
  },
  
  // Configuration for SendGrid (production)
  sendgridConfig: {
    apiKey: 'your-sendgrid-api-key'
  },
  
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
  },
  
  // List of admin email addresses that will receive admin notifications
  adminEmails: [UI_STRINGS.COMPANY.ADMIN_EMAIL]
};

export default emailConfig;
