
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
    
    await updateDoc(bookingRef, {
      'paymentInfo': paymentInfo,
      'basicInfo.status': 'confirmed',
      'updatedAt': serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving payment info:', error);
    throw error;
  }
};
