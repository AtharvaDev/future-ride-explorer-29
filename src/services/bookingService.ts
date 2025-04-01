import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  serverTimestamp,
  orderBy,
  Timestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { Car } from '@/data/cars';
import { getCarById } from './carService';
import { BookingData, BookingStatus, CompleteBookingData, PaymentInfo } from '@/types/booking';

// Retrieves all bookings for a user
export const getBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const bookings: CompleteBookingData[] = [];
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data() as BookingData;
      
      // Convert Firestore Timestamps to JavaScript Date objects
      const startDate = (data.startDate as unknown as Timestamp).toDate();
      const endDate = (data.endDate as unknown as Timestamp).toDate();
      const createdAt = data.createdAt ? (data.createdAt as unknown as Timestamp).toDate() : new Date();
      
      // Fetch the car data
      let car: Car | null = null;
      try {
        car = await getCarById(data.carId);
      } catch (err) {
        console.error(`Error fetching car ${data.carId}:`, err);
      }
      
      bookings.push({
        id: doc.id,
        ...data,
        startDate,
        endDate,
        createdAt,
        car: car || undefined,
      });
    }
    
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Get active bookings for a user (where start date <= current date)
export const getActiveBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  const allBookings = await getBookingsByUserId(userId);
  const currentDate = new Date();
  return allBookings.filter(booking => booking.startDate <= currentDate);
};

// Get past bookings for a user (where start date > current date)
export const getPastBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  const allBookings = await getBookingsByUserId(userId);
  const currentDate = new Date();
  return allBookings.filter(booking => booking.startDate > currentDate);
};

// Create a new booking
export const createBooking = async (bookingData: BookingData): Promise<string> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
      createdAt: serverTimestamp(),
      status: 'pending' as BookingStatus, // Set initial status to 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Update an existing booking
export const updateBooking = async (bookingId: string, updates: Partial<BookingData>): Promise<void> => {
  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingDocRef, updates);
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (bookingId: string): Promise<void> => {
  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    await deleteDoc(bookingDocRef);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId: string): Promise<CompleteBookingData | null> => {
  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    const docSnap = await getDoc(bookingDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as BookingData;

      // Convert Firestore Timestamps to JavaScript Date objects
      const startDate = (data.startDate as unknown as Timestamp).toDate();
      const endDate = (data.endDate as unknown as Timestamp).toDate();
      const createdAt = data.createdAt ? (data.createdAt as unknown as Timestamp).toDate() : new Date();

      // Fetch the car data
      let car: Car | null = null;
      try {
        car = await getCarById(data.carId);
      } catch (err) {
        console.error(`Error fetching car ${data.carId}:`, err);
      }

      return {
        id: docSnap.id,
        ...data,
        startDate,
        endDate,
        createdAt,
        car: car || undefined,
      };
    } else {
      console.log("No such booking!");
      return null;
    }
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

// Get bookings by car ID
export const getBookingsByCarId = async (carId: string): Promise<CompleteBookingData[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('carId', '==', carId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    const bookings: CompleteBookingData[] = [];

    for (const doc of querySnapshot.docs) {
      const data = doc.data() as BookingData;

      // Convert Firestore Timestamps to JavaScript Date objects
      const startDate = (data.startDate as unknown as Timestamp).toDate();
      const endDate = (data.endDate as unknown as Timestamp).toDate();
      const createdAt = data.createdAt ? (data.createdAt as unknown as Timestamp).toDate() : new Date();

      // Fetch the car data (optional, depending on your needs)
      let car: Car | null = null;
      try {
        car = await getCarById(data.carId);
      } catch (err) {
        console.error(`Error fetching car ${data.carId}:`, err);
      }

      bookings.push({
        id: doc.id,
        ...data,
        startDate,
        endDate,
        createdAt,
        car: car || undefined,
      });
    }

    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Update payment information for a booking
export const updatePaymentInfo = async (bookingId: string, paymentInfo: PaymentInfo): Promise<void> => {
  try {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingDocRef, { paymentInfo: paymentInfo });
  } catch (error) {
    console.error('Error updating payment info:', error);
    throw error;
  }
};
