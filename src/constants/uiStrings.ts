
import { NAVIGATION_STRINGS } from './strings/navigationStrings';
import { VIDEO_STRINGS } from './strings/videoStrings';
import { BOOKING_STRINGS } from './strings/bookingStrings';
import { LOGIN_STRINGS } from './strings/loginStrings';
import { NOT_FOUND_STRINGS } from './strings/notFoundStrings';
import { ADMIN_STRINGS } from './strings/adminStrings';
import { WHATSAPP_STRINGS } from './strings/whatsappStrings';
import { COMPANY_STRINGS } from './strings/companyStrings';
import { FOOTER_STRINGS } from './strings/footerStrings';
import { NOTIFICATION_STRINGS } from './strings/notificationStrings';

export const UI_STRINGS = {
  VIDEO: VIDEO_STRINGS,
  NAVIGATION: NAVIGATION_STRINGS,
  BOOKING: {
    ...BOOKING_STRINGS,
    HISTORY: BOOKING_STRINGS.HISTORY
  },
  LOGIN: LOGIN_STRINGS,
  NOT_FOUND: NOT_FOUND_STRINGS,
  ADMIN: ADMIN_STRINGS,
  WHATSAPP: WHATSAPP_STRINGS,
  COMPANY: COMPANY_STRINGS,
  FOOTER: FOOTER_STRINGS,
  NOTIFICATIONS: NOTIFICATION_STRINGS
};
