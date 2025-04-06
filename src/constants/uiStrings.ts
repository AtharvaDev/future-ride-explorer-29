
export const UI_STRINGS = {
  VIDEO: {
    LOADING: "Loading video...",
    SKIP_BUTTON: "Skip video",
  },
  NAVIGATION: {
    HOME: "Home",
    FLEET: "Fleet",
    CONTACT: "Contact",
    MY_BOOKINGS: "My Bookings",
    ADMIN: "Admin",
    LOGIN: "Login",
    LOGOUT: "Logout",
    PROFILE: "Profile",
  },
  BOOKING: {
    CONFIRMATION: {
      TITLE: "Booking Confirmed!",
      SUBTITLE: "Your booking has been successfully processed. A confirmation has been sent to your email and WhatsApp.",
      BOOKING_ID: "Booking ID",
      PAYMENT_STATUS: "Payment Status",
      PAID: "Paid",
      CAR: "Car",
      PAYMENT_AMOUNT: "Payment Amount",
      DATES: "Dates",
      PICKUP_LOCATION: "Pickup Location",
      NEED_ASSISTANCE: "Need assistance? Contact our support team at:",
      SUPPORT_PHONE: "+91-8850414839",
    },
    SUMMARY: {
      REVIEW_TITLE: "Review Your Booking",
      REVIEW_SUBTITLE: "Please review your booking details before proceeding to payment",
      CAR_DETAILS: "Car Details",
      DAILY_RATE: "Daily Rate",
      EXTRA_KM_RATE: "Extra KM Rate",
      TRIP_DETAILS: "Trip Details",
      START_DATE: "Start Date",
      END_DATE: "End Date",
      DURATION: "Duration",
      DAYS: "days",
      PICKUP_LOCATION: "Pickup Location",
      CONTACT_INFORMATION: "Contact Information",
      FULL_NAME: "Full Name",
      EMAIL: "Email",
      PHONE: "Phone",
      PAYMENT_SUMMARY: "Payment Summary",
      RENTAL: "Rental",
      TOTAL_AMOUNT: "Total Amount",
      EXTRA_KM_CHARGES: "Extra KM charges",
      TOKEN_AMOUNT: "Token Amount",
      REMAINING_AMOUNT: "* Remaining amount to be paid at pickup",
    },
    BUTTONS: {
      BACK: "Back",
      PROCEED_TO_PAYMENT: "Proceed to Payment",
      GO_HOME: "Go Home",
      VIEW_MY_BOOKINGS: "View My Bookings",
      SIGN_IN_TO_CONTINUE: "Sign In to Continue",
      BOOK_A_CAR: "Book a Car",
      BOOK_A_CAR_NOW: "Book a Car Now",
    },
    LOGIN_PROMPT: {
      TITLE: "Login Required",
      MESSAGE: "Please sign in to continue with your booking. Your booking information will be saved to your account.",
    },
  },
  BOOKING_HISTORY: {
    TITLE: "My Bookings",
    NO_ACTIVE_BOOKINGS: "No active bookings",
    NO_ACTIVE_DESCRIPTION: "You don't have any upcoming trips. Book a car to get started!",
    NO_PAST_BOOKINGS: "You don't have any past bookings.",
    PLEASE_LOGIN: "Please log in to view your bookings",
  },
  LOGIN: {
    TITLE: "Welcome to FutureRide",
    SUBTITLE: "Sign in to manage your bookings and more",
    GOOGLE_BUTTON: "Continue with Google",
    SIGNING_IN: "Signing in...",
    TERMS: "By signing in, you agree to our terms of service and privacy policy",
  },
  NOT_FOUND: {
    TITLE: "Page Not Found",
    SUBTITLE: "The page you are looking for doesn't exist or has been moved.",
    RETURN_HOME: "Return to Home",
  },
  ADMIN: {
    CONFIRM_DELETE: {
      TITLE: "Confirm Deletion",
      DESCRIPTION: "Are you sure you want to delete this item? This action cannot be undone.",
      CANCEL: "Cancel",
      DELETE: "Delete",
      DELETING: "Deleting...",
    },
    CAR_LIST: {
      TITLE: "Available Cars",
      DESCRIPTION: "Manage your fleet of vehicles here. You can add, edit, or remove cars.",
    },
  },
  WHATSAPP: {
    DEFAULT_MESSAGE: "Hello! I'm interested in FutureRide services.",
  },
  COMPANY: {
    NAME: "The Chauffeur Co.",
    CUSTOMER_SERVICE: "Customer Service",
    DESCRIPTION: "Experience luxury transportation with our premium car rental service.",
    PHONE: "+91 123 456 7890",
    EMAIL: "info@futureride.com",
    ADMIN_EMAIL: "admin@futureride.com", // Added ADMIN_EMAIL property
    ADDRESS: [
      "123 Future Street",
      "Bangalore, Karnataka 560001",
      "India"
    ]
  },
  FOOTER: {
    QUICK_LINKS: {
      TITLE: "Quick Links",
      PRICING: "Pricing",
      BOOKING: "Booking",
      ABOUT_US: "About Us"
    },
    SUPPORT: {
      TITLE: "Support",
      FAQ: "FAQ",
      CONTACT_US: "Contact Us",
      TERMS: "Terms & Conditions",
      PRIVACY: "Privacy Policy",
      REFUND: "Refund Policy"
    },
    COPYRIGHT: "&copy; {{year}} The Chauffeur Co. All rights reserved."
  },
  NOTIFICATIONS: {
    EMAIL: {
      BOOKING_CONFIRMATION: {
        SUBJECT: "Your FutureRide Booking Confirmation - {{bookingId}}",
        BODY: `
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
      PAYMENT_CONFIRMATION: {
        SUBJECT: "Payment Confirmation for FutureRide Booking - {{bookingId}}",
        BODY: `
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
      BOOKING_REMINDER: {
        SUBJECT: "Reminder: Your FutureRide Booking is Coming Up - {{bookingId}}",
        BODY: `
          <h1>Booking Reminder</h1>
          <p>Dear {{name}},</p>
          <p>This is a friendly reminder that your FutureRide booking is coming up!</p>
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
      BOOKING_CANCELLATION: {
        SUBJECT: "Your FutureRide Booking Has Been Cancelled - {{bookingId}}",
        BODY: `
          <h1>Booking Cancellation</h1>
          <p>Dear {{name}},</p>
          <p>Your booking (ID: {{bookingId}}) has been cancelled as requested.</p>
          <p>If you paid a token amount, it will be refunded within 3-5 business days.</p>
          <p>We hope to serve you again in the future!</p>
          <p>If you need any assistance, please contact our support team at: +91-8850414839</p>
        `
      }
    },
    WHATSAPP: {
      BOOKING_CONFIRMATION: `🚗 *The Chauffeur Co. Booking Confirmed!*
      
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

      PAYMENT_CONFIRMATION: `💰 *The Chauffeur Co. Payment Received*
      
Hello {{name}},

We've received your payment of ₹{{amountPaid}} for booking {{bookingId}}.

Your booking is now fully confirmed.

Thank you for choosing The Chauffeur Co.!

For any assistance, please contact our support team at: +91-8850414839`,

      BOOKING_REMINDER: `🔔 *The Chauffeur Co. Booking Reminder*
      
Hello {{name}},

Your FutureRide booking is coming up soon!

• Car: {{carModel}}
• Date: {{startDate}}
• Starting Location: {{startCity}}

Please remember to bring your license and payment method.

Looking forward to seeing you soon!

For any assistance, please contact our support team at: +91-8850414839`,

      BOOKING_CANCELLATION: `❌ *The Chauffeur Co. Booking Cancelled*
      
Hello {{name}},

Your booking ({{bookingId}}) has been cancelled as requested.

If you paid a token amount, it will be refunded within 3-5 business days.

We hope to serve you again soon!

For any assistance, please contact our support team at: +91-8850414839`
    }
  }
};
