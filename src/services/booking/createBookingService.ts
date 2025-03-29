
import { db } from '@/config/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { Booking } from '@/types/booking';

/**
 * Create a new booking in Firestore
 */
export const createBooking = async (bookingData: any): Promise<{id: string}> => {
  try {
    const { userId } = bookingData;
    const userBookingsRef = collection(db, 'users', userId, 'bookings');
    const bookingRef = doc(userBookingsRef);
    const bookingId = bookingRef.id;
    
    // Add the booking ID to the data
    const completeBookingData = {
      ...bookingData,
      id: bookingId,
      createdAt: new Date(),
    };
    
    await setDoc(bookingRef, completeBookingData);
    
    return { id: bookingId };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};
