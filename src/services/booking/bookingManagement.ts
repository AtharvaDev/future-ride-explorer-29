
import { db } from '@/config/firebase';
import { 
  doc, 
  deleteDoc
} from 'firebase/firestore';

/**
 * Delete a booking
 */
export const deleteBooking = async (userId: string, bookingId: string): Promise<void> => {
  try {
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    await deleteDoc(bookingRef);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};
