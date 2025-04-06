
/**
 * Payment Features Configuration
 * 
 * This file contains configuration options for payment-related features.
 * You can easily enable or disable payment features by changing these settings.
 */

export interface PaymentConfig {
  enabled: boolean;          // Master switch for all payment features
  paymentStep: {
    enabled: boolean;        // Enable/disable the payment step in booking flow
    tokenAmount: number;     // Default token amount
  };
  paymentMethods: {
    razorpay: boolean;       // Enable/disable Razorpay payment method
    upi: boolean;            // Enable/disable UPI payment method
    card: boolean;           // Enable/disable Card payment method
  };
}

const paymentConfig: PaymentConfig = {
  // Master switch for all payment features
  enabled: true,
  
  // Payment step configuration
  paymentStep: {
    enabled: false,          // Set to false to disable payment step (can be enabled in future release)
    tokenAmount: 1000,       // Default token amount of 1000 Rs
  },
  
  // Available payment methods
  paymentMethods: {
    razorpay: true,
    upi: true,
    card: false,             // Card payments currently disabled
  }
};

export default paymentConfig;
