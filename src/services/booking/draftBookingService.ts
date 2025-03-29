
import { db } from '@/config/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { BookingBasicInfo, BookingContactInfo } from '@/types/booking';

/**
 * Check if a user has any existing draft bookings
 */
export const getExistingDraftBooking = async (userId: string): Promise<string | null> => {
  try {
    const bookingsRef = collection(db, 'users', userId, 'bookings');
    const q = query(
      bookingsRef,
      where('basicInfo.status', '==', 'draft'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking for existing draft bookings:', error);
    throw error;
  }
};

/**
 * Save or update booking basic information
 */
export const saveBookingBasicInfo = async (
  bookingData: BookingBasicInfo,
  userId: string
): Promise<string> => {
  try {
    const userBookingsRef = collection(db, 'users', userId, 'bookings');
    let bookingId = bookingData.id;
    
    if (!bookingId) {
      const existingDraftId = await getExistingDraftBooking(userId);
      
      if (existingDraftId) {
        bookingId = existingDraftId;
        
        const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
        await updateDoc(bookingRef, {
          'basicInfo': {
            ...bookingData,
            id: bookingId
          },
          'updatedAt': serverTimestamp()
        });
        
        console.log('Updated existing draft booking:', bookingId);
        return bookingId;
      }
      
      const newBookingRef = doc(userBookingsRef);
      bookingId = newBookingRef.id;
      
      await setDoc(newBookingRef, {
        basicInfo: {
          ...bookingData,
          id: bookingId
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        'basicInfo': {
          ...bookingData,
          id: bookingId
        },
        'updatedAt': serverTimestamp()
      });
    }
    
    return bookingId;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

/**
 * Save contact information for a booking
 */
export const saveBookingContactInfo = async (
  bookingId: string,
  contactInfo: BookingContactInfo,
  userId: string
): Promise<void> => {
  try {
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      'contactInfo': contactInfo,
      'updatedAt': serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving contact info:', error);
    throw error;
  }
};
