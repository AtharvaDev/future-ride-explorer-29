
import { db } from '@/config/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { toast } from 'sonner';

// Type definitions
export interface BookingBasicInfo {
  id?: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  startCity: string;
  status: BookingStatus;
  userId: string;
}

export interface BookingContactInfo {
  name: string;
  email: string;
  phone: string;
  startCity: string;
  specialRequests?: string;
}

export interface BookingPaymentInfo {
  paymentMethod: 'upi' | 'card' | 'cash';
  upiId?: string;
  tokenAmount: number;
  totalAmount: number;
  isPaid: boolean;
}

export type BookingStatus = 'draft' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  basicInfo: BookingBasicInfo;
  contactInfo?: BookingContactInfo;
  paymentInfo?: BookingPaymentInfo;
  car?: {
    id: string;
    name: string;
    image: string;
    pricePerDay: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Function to convert Firestore Timestamp to Date
const convertTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Function to save basic booking information
export const saveBookingBasicInfo = async (
  bookingData: BookingBasicInfo,
  userId: string
): Promise<string> => {
  try {
    const userBookingsRef = collection(db, 'users', userId, 'bookings');
    let bookingId = bookingData.id;
    
    if (!bookingId) {
      // Create a new document reference with auto-generated ID
      const newBookingRef = doc(userBookingsRef);
      bookingId = newBookingRef.id;
      
      // Create the booking with basic info
      await setDoc(newBookingRef, {
        basicInfo: {
          ...bookingData,
          id: bookingId
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      // Update existing booking
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

// Function to save contact information
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

// Function to save payment information
export const saveBookingPaymentInfo = async (
  bookingId: string,
  paymentInfo: BookingPaymentInfo,
  userId: string
): Promise<void> => {
  try {
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    
    // Update the booking with payment info and set status to confirmed
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

// Function to get a booking by ID
export const getBookingById = async (userId: string, bookingId: string): Promise<Booking | null> => {
  try {
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (bookingSnap.exists()) {
      const data = bookingSnap.data();
      
      // Convert Firestore Timestamps to JavaScript Dates
      return {
        id: bookingId,
        basicInfo: {
          ...data.basicInfo,
          startDate: data.basicInfo.startDate instanceof Timestamp ? 
            convertTimestampToDate(data.basicInfo.startDate) : 
            data.basicInfo.startDate,
          endDate: data.basicInfo.endDate instanceof Timestamp ? 
            convertTimestampToDate(data.basicInfo.endDate) : 
            data.basicInfo.endDate
        },
        contactInfo: data.contactInfo,
        paymentInfo: data.paymentInfo,
        car: data.car,
        createdAt: data.createdAt instanceof Timestamp ? 
          convertTimestampToDate(data.createdAt) : 
          data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? 
          convertTimestampToDate(data.updatedAt) : 
          data.updatedAt
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
};

// Function to get all bookings for a user
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
            convertTimestampToDate(data.basicInfo.startDate) : 
            data.basicInfo.startDate,
          endDate: data.basicInfo.endDate instanceof Timestamp ? 
            convertTimestampToDate(data.basicInfo.endDate) : 
            data.basicInfo.endDate
        },
        contactInfo: data.contactInfo,
        paymentInfo: data.paymentInfo,
        car: data.car,
        createdAt: data.createdAt instanceof Timestamp ? 
          convertTimestampToDate(data.createdAt) : 
          data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? 
          convertTimestampToDate(data.updatedAt) : 
          data.updatedAt
      });
    });
    
    return bookings;
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
};

// Function to delete a booking
export const deleteBooking = async (userId: string, bookingId: string): Promise<void> => {
  try {
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    await deleteDoc(bookingRef);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};
