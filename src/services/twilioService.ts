import twilioConfig from '@/config/twilioConfig';
import emailConfig, { EmailProvider } from '@/config/emailConfig';
import { SmtpClient, MailOptions } from '@/utils/smtpClient';
import { SendGridClient, SendGridMailOptions } from '@/utils/sendGridClient';

interface TwilioMessageOptions {
  to: string;
  body: string;
  from?: string;
}

interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

interface EmailOptions {
  to: string[];
  subject: string;
  body: string;
  from?: {
    name: string;
    email: string;
  };
  attachments?: EmailAttachment[];
}

// WhatsApp message (mocked, browser only)
export const sendWhatsAppMessage = async (options: TwilioMessageOptions): Promise<boolean> => {
  if (!twilioConfig.enabled || !twilioConfig.services.whatsapp.enabled) {
    console.log('[TWILIO] WhatsApp service is disabled. Enable it in twilioConfig.ts');
    return false;
  }
  const { to, body, from = twilioConfig.services.whatsapp.fromNumber } = options;
  try {
    let formattedTo = to;
    if (!formattedTo.startsWith('whatsapp:')) {
      formattedTo = formattedTo.replace(/\D/g, '');
      if (!formattedTo.startsWith('91') && formattedTo.length === 10) {
        formattedTo = `91${formattedTo}`;
      }
      formattedTo = `whatsapp:+${formattedTo}`;
    }
    console.log(`[TWILIO MOCK] Sending WhatsApp message to ${formattedTo} from ${from}:`);
    console.log(`[TWILIO MOCK] Message: ${body}`);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
};

// SMS message (mocked, browser only)
export const sendSmsMessage = async (options: TwilioMessageOptions): Promise<boolean> => {
  if (!twilioConfig.enabled || !twilioConfig.services.sms.enabled) {
    console.log('[TWILIO] SMS service is disabled. Enable it in twilioConfig.ts');
    return false;
  }
  const { to, body, from = twilioConfig.services.sms.fromNumber } = options;
  try {
    console.log(`[TWILIO MOCK] Sending SMS to ${to} from ${from}:`);
    console.log(`[TWILIO MOCK] Message: ${body}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS message:', error);
    return false;
  }
};

// PRODUCTION sendEmail supporting Nodemailer and SendGrid
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  if (!emailConfig.enabled) {
    console.log('[EMAIL] Email service is disabled. Enable it in emailConfig.ts');
    return false;
  }

  const provider: EmailProvider = emailConfig.provider;
  const {
    to,
    subject,
    body,
    from = { name: emailConfig.sender.name, email: emailConfig.sender.email },
    attachments = [],
  } = options;

  try {
    if (provider === 'nodemailer') {
      // Use SmtpClient ("backend" class wraps Nodemailer for Node.js only)
      // Only attempt to send if not in browser
      if (typeof window !== 'undefined') {
        console.log(`[EMAIL MOCK - nodemailer] Would send email to ${to.join(', ')} from ${from.name} <${from.email}>:`);
        console.log(`[EMAIL MOCK] Subject: ${subject}`);
        console.log(`[EMAIL MOCK] Body: ${body}`);
        return true;
      }
      const smtpClient = new SmtpClient();
      const smtpAttachments = attachments.map(att => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType
      }));
      const mailOptions: MailOptions = {
        from: `"${from.name}" <${from.email}>`,
        to: to.join(','),
        subject,
        html: body,
        attachments: smtpAttachments,
      };
      await smtpClient.sendMail(mailOptions);
      console.log(`[EMAIL PROD nodemailer] Email sent to ${to.join(', ')}`);
      return true;
    } else if (provider === 'sendgrid') {
      const sendGridClient = new SendGridClient();
      // Map attachments to SendGrid spec
      const sgAttachments = attachments.map(att => ({
        content: typeof att.content === 'string' ? (typeof window !== 'undefined' ? att.content : Buffer.from(att.content as string).toString('base64')) : (att.content as Buffer).toString('base64'),
        filename: att.filename,
        type: att.contentType ?? 'application/octet-stream',
        disposition: 'attachment'
      }));
      const sgMailOptions: SendGridMailOptions = {
        from,
        to: to.map(email => ({ email })),
        subject,
        html: body,
        attachments: sgAttachments.length > 0 ? sgAttachments : undefined,
      };
      await sendGridClient.send(sgMailOptions);
      console.log(`[EMAIL PROD sendgrid] Email sent to ${to.join(', ')}`);
      return true;
    } else {
      console.error(`[EMAIL] Unknown provider: ${provider}`);
      return false;
    }
  } catch (error) {
    console.error(`Error sending email via ${provider}:`, error);
    return false;
  }
};
