
import { db } from '@/config/firebase';
import { 
  doc, 
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { BookingPaymentInfo } from '@/types/booking';

/**
 * Save payment information and update booking status to confirmed
 */
export const saveBookingPaymentInfo = async (
  bookingId: string,
  paymentInfo: BookingPaymentInfo,
  userId: string
): Promise<void> => {
  try {
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    
    const paymentData = {
      ...paymentInfo,
      paidAt: new Date()
    };
    
    await updateDoc(bookingRef, {
      'paymentInfo': paymentData,
      'basicInfo.status': 'confirmed',
      'updatedAt': serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving payment info:', error);
    throw error;
  }
};

/**
 * Verify a payment status (useful for Razorpay verification)
 */
export const verifyPayment = async (
  paymentId: string,
  bookingId: string,
  userId: string
): Promise<boolean> => {
  try {
    // In a real app, you would verify the payment with Razorpay API
    // For demo purposes, we'll assume all payments with an ID are valid
    if (paymentId) {
      // Update booking payment status if needed
      const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        'paymentInfo.verified': true,
        'updatedAt': serverTimestamp()
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};
