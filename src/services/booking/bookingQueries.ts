
import { db } from '@/config/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { Booking, CompleteBookingData } from '@/types/booking';
import { ensureDate } from '@/utils/bookingUtils';

/**
 * Get a specific booking by ID
 */
export const getBookingById = async (userId: string, bookingId: string): Promise<Booking | null> => {
  try {
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (bookingSnap.exists()) {
      const data = bookingSnap.data();
      
      return {
        id: bookingId,
        basicInfo: {
          ...data.basicInfo,
          startDate: data.basicInfo.startDate instanceof Timestamp ? 
            ensureDate(data.basicInfo.startDate) : 
            data.basicInfo.startDate,
          endDate: data.basicInfo.endDate instanceof Timestamp ? 
            ensureDate(data.basicInfo.endDate) : 
            data.basicInfo.endDate
        },
        contactInfo: data.contactInfo,
        paymentInfo: data.paymentInfo,
        car: data.car,
        createdAt: data.createdAt instanceof Timestamp ? 
          ensureDate(data.createdAt) : 
          data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? 
          ensureDate(data.updatedAt) : 
          data.updatedAt
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
};

/**
 * Get all bookings for a user
 */
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'users', userId, 'bookings');
    const q = query(bookingsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const bookings: Booking[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        basicInfo: {
          ...data.basicInfo,
          startDate: data.basicInfo.startDate instanceof Timestamp ? 
            ensureDate(data.basicInfo.startDate) : 
            data.basicInfo.startDate,
          endDate: data.basicInfo.endDate instanceof Timestamp ? 
            ensureDate(data.basicInfo.endDate) : 
            data.basicInfo.endDate
        },
        contactInfo: data.contactInfo,
        paymentInfo: data.paymentInfo,
        car: data.car,
        createdAt: data.createdAt instanceof Timestamp ? 
          ensureDate(data.createdAt) : 
          data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? 
          ensureDate(data.updatedAt) : 
          data.updatedAt
      });
    });
    
    return bookings;
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
};

/**
 * Get all active bookings for a user
 */
export const getActiveBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    const bookingsRef = collection(db, 'users', userId, 'bookings');
    
    const q = query(
      bookingsRef,
      where('basicInfo.status', '==', 'confirmed')
    );
    
    const querySnapshot = await getDocs(q);
    const activeBookings: CompleteBookingData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const startDate = data.basicInfo.startDate instanceof Timestamp ? 
        ensureDate(data.basicInfo.startDate) : 
        new Date(data.basicInfo.startDate);
      const endDate = data.basicInfo.endDate instanceof Timestamp ? 
        ensureDate(data.basicInfo.endDate) : 
        new Date(data.basicInfo.endDate);
      
      activeBookings.push({
        id: doc.id,
        carId: data.basicInfo.carId,
        startDate,
        endDate,
        startCity: data.basicInfo.startCity,
        status: data.basicInfo.status,
        car: data.car,
        paymentInfo: data.paymentInfo,
        userId: data.basicInfo.userId || userId
      });
    });
    
    return activeBookings;
  } catch (error) {
    console.error('Error getting active bookings:', error);
    throw error;
  }
};

/**
 * Get all past bookings for a user
 */
export const getPastBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    const bookingsRef = collection(db, 'users', userId, 'bookings');
    
    const q = query(
      bookingsRef,
      where('basicInfo.status', 'in', ['completed', 'cancelled'])
    );
    
    const querySnapshot = await getDocs(q);
    const pastBookings: CompleteBookingData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const startDate = data.basicInfo.startDate instanceof Timestamp ? 
        ensureDate(data.basicInfo.startDate) : 
        new Date(data.basicInfo.startDate);
      const endDate = data.basicInfo.endDate instanceof Timestamp ? 
        ensureDate(data.basicInfo.endDate) : 
        new Date(data.basicInfo.endDate);
      
      pastBookings.push({
        id: doc.id,
        carId: data.basicInfo.carId,
        startDate,
        endDate,
        startCity: data.basicInfo.startCity,
        status: data.basicInfo.status,
        car: data.car,
        paymentInfo: data.paymentInfo,
        userId: data.basicInfo.userId || userId
      });
    });
    
    return pastBookings;
  } catch (error) {
    console.error('Error getting past bookings:', error);
    throw error;
  }
};
