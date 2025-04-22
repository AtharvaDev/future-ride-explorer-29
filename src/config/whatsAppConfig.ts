
/**
 * WhatsApp Notification Configuration
 */

import { UI_STRINGS } from '@/constants/uiStrings';

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

export interface WhatsAppConfig {
  enabled: boolean;
  templates: {
    bookingConfirmation: string;
    paymentConfirmation: string;
    bookingReminder: string;
    bookingCancellation: string;
    refundConfirmation: string;
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
    bookingCancellation: UI_STRINGS.NOTIFICATIONS.WHATSAPP.BOOKING_CANCELLATION,
    refundConfirmation: "Your refund for booking ID {{bookingId}} has been processed and will be credited soon. Thank you for your patience."
  },
  sender: {
    phone: "+917066569090",
    businessName: UI_STRINGS.COMPANY.NAME
  },
  adminNumber: "whatsapp:+917066569090",
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
  }
};

export default whatsAppConfig;
