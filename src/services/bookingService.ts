
import { db } from '@/config/firebase';
import { 
  collection,
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { Car } from '@/data/cars';
import { v4 as uuidv4 } from 'uuid';

// Booking interfaces
export interface BookingBasicInfo {
  id?: string;
  userId?: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  startCity: string;
  status: 'draft' | 'pending' | 'confirmed' | 'cancelled';
  createdAt?: any;
  updatedAt?: any;
}

export interface BookingContactInfo {
  name: string;
  email: string;
  phone: string;
  startCity: string;
  specialRequests?: string;
}

export interface BookingPaymentInfo {
  paymentMethod: string;
  upiId?: string;
  tokenAmount: number;
  totalAmount?: number;
  isPaid: boolean;
}

export interface CompleteBookingData extends BookingBasicInfo, BookingContactInfo, BookingPaymentInfo {
  car?: Car;
}

// Save booking date/trip information
export const saveBookingBasicInfo = async (
  bookingInfo: BookingBasicInfo,
  userId?: string
): Promise<string> => {
  try {
    let bookingId = bookingInfo.id || uuidv4();
    
    const bookingData = {
      ...bookingInfo,
      id: bookingId,
      userId: userId || null,
      status: bookingInfo.status || 'draft',
      createdAt: bookingInfo.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, 'bookings', bookingId), bookingData);
    return bookingId;
  } catch (error) {
    console.error('Error saving booking basic info:', error);
    throw error;
  }
};

// Save booking contact information
export const saveBookingContactInfo = async (
  bookingId: string,
  contactInfo: BookingContactInfo
): Promise<void> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingDoc = await getDoc(bookingRef);
    
    if (!bookingDoc.exists()) {
      throw new Error('Booking not found');
    }
    
    await setDoc(bookingRef, {
      ...bookingDoc.data(),
      ...contactInfo,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving booking contact info:', error);
    throw error;
  }
};

// Save booking payment information
export const saveBookingPaymentInfo = async (
  bookingId: string,
  paymentInfo: BookingPaymentInfo
): Promise<void> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingDoc = await getDoc(bookingRef);
    
    if (!bookingDoc.exists()) {
      throw new Error('Booking not found');
    }
    
    await setDoc(bookingRef, {
      ...bookingDoc.data(),
      ...paymentInfo,
      status: paymentInfo.isPaid ? 'confirmed' : 'pending',
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving booking payment info:', error);
    throw error;
  }
};

// Get a booking by ID
export const getBookingById = async (bookingId: string): Promise<CompleteBookingData | null> => {
  try {
    const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
    
    if (!bookingDoc.exists()) {
      return null;
    }
    
    const bookingData = bookingDoc.data() as CompleteBookingData;
    
    // Convert Firestore timestamps to Date objects
    if (bookingData.startDate) {
      bookingData.startDate = bookingData.startDate.toDate ? 
        bookingData.startDate.toDate() : new Date(bookingData.startDate);
    }
    
    if (bookingData.endDate) {
      bookingData.endDate = bookingData.endDate.toDate ? 
        bookingData.endDate.toDate() : new Date(bookingData.endDate);
    }
    
    return bookingData;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
};

// Get bookings by user ID
export const getBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const bookingDocs = await getDocs(bookingsQuery);
    return bookingDocs.docs.map(doc => {
      const data = doc.data() as CompleteBookingData;
      
      // Convert Firestore timestamps to Date objects
      if (data.startDate) {
        data.startDate = data.startDate.toDate ? 
          data.startDate.toDate() : new Date(data.startDate);
      }
      
      if (data.endDate) {
        data.endDate = data.endDate.toDate ? 
          data.endDate.toDate() : new Date(data.endDate);
      }
      
      return data;
    });
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
};

// Get active bookings by user ID (end date is in the future)
export const getActiveBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    const allBookings = await getBookingsByUserId(userId);
    const now = new Date();
    
    return allBookings.filter(booking => {
      return booking.endDate > now && booking.status !== 'cancelled';
    });
  } catch (error) {
    console.error('Error getting active bookings:', error);
    throw error;
  }
};

// Get past bookings by user ID (end date is in the past)
export const getPastBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    const allBookings = await getBookingsByUserId(userId);
    const now = new Date();
    
    return allBookings.filter(booking => {
      return booking.endDate <= now || booking.status === 'cancelled';
    });
  } catch (error) {
    console.error('Error getting past bookings:', error);
    throw error;
  }
};

// Get all bookings for admin
export const getAllBookings = async (): Promise<CompleteBookingData[]> => {
  try {
    const bookingDocs = await getDocs(collection(db, 'bookings'));
    return bookingDocs.docs.map(doc => {
      const data = doc.data() as CompleteBookingData;
      
      // Convert Firestore timestamps to Date objects
      if (data.startDate) {
        data.startDate = data.startDate.toDate ? 
          data.startDate.toDate() : new Date(data.startDate);
      }
      
      if (data.endDate) {
        data.endDate = data.endDate.toDate ? 
          data.endDate.toDate() : new Date(data.endDate);
      }
      
      return data;
    });
  } catch (error) {
    console.error('Error getting all bookings:', error);
    throw error;
  }
};
