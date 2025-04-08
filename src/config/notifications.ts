
// Notification configuration file

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

export const emailConfig: EmailConfig = {
  enabled: true,
  templates: {
    bookingConfirmation: {
      subject: "Your The Chauffeur Co. Booking Confirmation - {{bookingId}}",
      body: `
        <h1>Booking Confirmation</h1>
        <p>Dear {{name}},</p>
        <p>Your booking for {{carModel}} has been confirmed. Here are the details:</p>
        <ul>
          <li>Booking ID: {{bookingId}}</li>
          <li>Car: {{carModel}}</li>
          <li>Start Date: {{startDate}}</li>
          <li>End Date: {{endDate}}</li>
          <li>Total Amount: ₹{{totalAmount}}</li>
          <li>Token Amount Paid: ₹{{tokenAmount}}</li>
        </ul>
        <p>You can view your booking details at any time by visiting your <a href="{{bookingUrl}}">booking dashboard</a>.</p>
        <p>Thank you for choosing The Chauffeur Co.!</p>
        <p>If you need any assistance, please contact our support team at: +91-8850414839</p>
      `
    },
    paymentConfirmation: {
      subject: "Payment Confirmation for The Chauffeur Co. Booking - {{bookingId}}",
      body: `
        <h1>Payment Confirmation</h1>
        <p>Dear {{name}},</p>
        <p>We've received your payment for booking ID {{bookingId}}.</p>
        <ul>
          <li>Amount Paid: ₹{{amountPaid}}</li>
          <li>Payment Date: {{paymentDate}}</li>
          <li>Payment Method: {{paymentMethod}}</li>
        </ul>
        <p>Your booking is now fully confirmed.</p>
        <p>Thank you for choosing The Chauffeur Co.!</p>
        <p>If you need any assistance, please contact our support team at: +91-8850414839</p>
      `
    },
    bookingReminder: {
      subject: "Reminder: Your The Chauffeur Co. Booking is Coming Up - {{bookingId}}",
      body: `
        <h1>Booking Reminder</h1>
        <p>Dear {{name}},</p>
        <p>This is a friendly reminder that your The Chauffeur Co. booking is coming up!</p>
        <ul>
          <li>Car: {{carModel}}</li>
          <li>Start Date: {{startDate}}</li>
          <li>Starting Location: {{startCity}}</li>
        </ul>
        <p>Please remember to bring your license and payment method.</p>
        <p>Looking forward to seeing you soon!</p>
        <p>If you need any assistance, please contact our support team at: +91-8850414839</p>
      `
    },
    bookingCancellation: {
      subject: "Your The Chauffeur Co. Booking Has Been Cancelled - {{bookingId}}",
      body: `
        <h1>Booking Cancellation</h1>
        <p>Dear {{name}},</p>
        <p>Your booking (ID: {{bookingId}}) has been cancelled as requested.</p>
        <p>If you paid a token amount, it will be refunded within 3-5 business days.</p>
        <p>We hope to serve you again in the future!</p>
        <p>If you need any assistance, please contact our support team at: +91-8850414839</p>
      `
    }
  },
  sender: {
    name: "The Chauffeur Co. Customer Service",
    email: "notifications@The Chauffeur Co..com"
  },
  adminNotifications: {
    bookingConfirmation: true,
    paymentConfirmation: true,
    userSignup: true,
    profileUpdate: true,
    bookingAttempt: true
  }
};

export const whatsAppConfig: WhatsAppConfig = {
  enabled: true,
  templates: {
    bookingConfirmation: `🚗 *The Chauffeur Co. Booking Confirmed!*
    
Hello {{name}},

Your booking for {{carModel}} ({{bookingId}}) is confirmed.

*Trip Details:*
• {{startDate}} to {{endDate}}
• Starting Location: {{startCity}}
• Total Amount: ₹{{totalAmount}}
• Token Amount Paid: ₹{{tokenAmount}}

Click here to view details: {{bookingUrl}}

Thank you for choosing The Chauffeur Co.!

For any assistance, please contact our support team at: +91-8850414839`,

    paymentConfirmation: `💰 *The Chauffeur Co. Payment Received*
    
Hello {{name}},

We've received your payment of ₹{{amountPaid}} for booking {{bookingId}}.

Your booking is now fully confirmed.

Thank you for choosing The Chauffeur Co.!

For any assistance, please contact our support team at: +91-8850414839`,

    bookingReminder: `🔔 *The Chauffeur Co. Booking Reminder*
    
Hello {{name}},

Your The Chauffeur Co. booking is coming up soon!

• Car: {{carModel}}
• Date: {{startDate}}
• Starting Location: {{startCity}}

Please remember to bring your license and payment method.

Looking forward to seeing you soon!

For any assistance, please contact our support team at: +91-8850414839`,

    bookingCancellation: `❌ *The Chauffeur Co. Booking Cancelled*
    
Hello {{name}},

Your booking ({{bookingId}}) has been cancelled as requested.

If you paid a token amount, it will be refunded within 3-5 business days.

We hope to serve you again soon!

For any assistance, please contact our support team at: +91-8850414839`
  },
  sender: {
    phone: "+918850414839",
    businessName: "The Chauffeur Co."
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
