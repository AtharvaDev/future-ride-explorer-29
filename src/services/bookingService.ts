
import { db } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  Timestamp,
  documentId 
} from 'firebase/firestore';
import { getCarById } from './carService';
import { toast } from 'sonner';
import { Car } from '@/data/cars';

export interface Booking {
  id?: string;
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  startCity: string;
  numberOfPassengers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}

export interface CompleteBookingData extends Booking {
  car?: Car;
}

// Create a new booking within the user's bookings subcollection
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
  try {
    // Reference to the user's bookings subcollection
    const userBookingsRef = collection(db, 'users', bookingData.userId, 'bookings');
    
    const newBooking = {
      ...bookingData,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(userBookingsRef, {
      ...newBooking,
      startDate: Timestamp.fromDate(newBooking.startDate),
      endDate: Timestamp.fromDate(newBooking.endDate),
      createdAt: Timestamp.fromDate(newBooking.createdAt)
    });
    
    return { id: docRef.id, ...newBooking };
  } catch (error) {
    console.error('Error creating booking:', error);
    toast.error('Failed to create booking');
    throw error;
  }
};

// Get all bookings for a specific user
export const getBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    const userBookingsRef = collection(db, 'users', userId, 'bookings');
    const querySnapshot = await getDocs(userBookingsRef);
    
    const bookings: CompleteBookingData[] = [];
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const booking: CompleteBookingData = {
        id: doc.id,
        userId: data.userId,
        carId: data.carId,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        startCity: data.startCity,
        numberOfPassengers: data.numberOfPassengers,
        totalPrice: data.totalPrice,
        status: data.status,
        createdAt: data.createdAt.toDate()
      };
      
      try {
        // Try to get car details
        const car = await getCarById(data.carId);
        if (car) {
          booking.car = car;
        }
      } catch (carError) {
        console.error('Error fetching car details:', carError);
      }
      
      bookings.push(booking);
    }
    
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    toast.error('Failed to fetch bookings');
    throw error;
  }
};

// Get active (pending or confirmed) bookings for a user
export const getActiveBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    const allBookings = await getBookingsByUserId(userId);
    
    return allBookings.filter(booking => 
      booking.status === 'pending' || booking.status === 'confirmed');
  } catch (error) {
    console.error('Error fetching active bookings:', error);
    toast.error('Failed to fetch active bookings');
    throw error;
  }
};

// Get past (completed or cancelled) bookings for a user
export const getPastBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    const allBookings = await getBookingsByUserId(userId);
    
    return allBookings.filter(booking => 
      booking.status === 'completed' || booking.status === 'cancelled');
  } catch (error) {
    console.error('Error fetching past bookings:', error);
    toast.error('Failed to fetch past bookings');
    throw error;
  }
};

// Update a booking
export const updateBooking = async (userId: string, bookingId: string, updates: Partial<Booking>) => {
  try {
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    
    const updatesWithTimestamps = { ...updates };
    
    if (updates.startDate) {
      updatesWithTimestamps.startDate = Timestamp.fromDate(updates.startDate);
    }
    
    if (updates.endDate) {
      updatesWithTimestamps.endDate = Timestamp.fromDate(updates.endDate);
    }
    
    await updateDoc(bookingRef, updatesWithTimestamps);
    return { id: bookingId, ...updates };
  } catch (error) {
    console.error('Error updating booking:', error);
    toast.error('Failed to update booking');
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (userId: string, bookingId: string) => {
  try {
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    await deleteDoc(bookingRef);
    return true;
  } catch (error) {
    console.error('Error deleting booking:', error);
    toast.error('Failed to delete booking');
    throw error;
  }
};

// Get a single booking by ID
export const getBookingById = async (userId: string, bookingId: string): Promise<CompleteBookingData | null> => {
  try {
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      return null;
    }
    
    const data = bookingSnap.data();
    const booking: CompleteBookingData = {
      id: bookingSnap.id,
      userId: data.userId,
      carId: data.carId,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      startCity: data.startCity,
      numberOfPassengers: data.numberOfPassengers,
      totalPrice: data.totalPrice,
      status: data.status,
      createdAt: data.createdAt.toDate()
    };
    
    try {
      // Try to get car details
      const car = await getCarById(data.carId);
      if (car) {
        booking.car = car;
      }
    } catch (carError) {
      console.error('Error fetching car details:', carError);
    }
    
    return booking;
  } catch (error) {
    console.error('Error fetching booking:', error);
    toast.error('Failed to fetch booking details');
    throw error;
  }
};

// For admin use: Get all bookings across all users (admin access)
export const getAllBookings = async (): Promise<CompleteBookingData[]> => {
  try {
    // Get all users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    const allBookings: CompleteBookingData[] = [];
    
    // For each user, get their bookings
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userBookingsRef = collection(db, 'users', userId, 'bookings');
      const bookingsSnapshot = await getDocs(userBookingsRef);
      
      for (const bookingDoc of bookingsSnapshot.docs) {
        const data = bookingDoc.data();
        const booking: CompleteBookingData = {
          id: bookingDoc.id,
          userId: data.userId,
          carId: data.carId,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
          startCity: data.startCity,
          numberOfPassengers: data.numberOfPassengers,
          totalPrice: data.totalPrice,
          status: data.status,
          createdAt: data.createdAt.toDate()
        };
        
        try {
          // Try to get car details
          const car = await getCarById(data.carId);
          if (car) {
            booking.car = car;
          }
        } catch (carError) {
          console.error('Error fetching car details:', carError);
        }
        
        allBookings.push(booking);
      }
    }
    
    return allBookings;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    toast.error('Failed to fetch all bookings');
    throw error;
  }
};

// Now we need to update the initService to ensure our user collection exists
export const migrateBookingsToUserSubcollections = async () => {
  try {
    // This function would handle migration of existing bookings to the new structure
    // This would only be needed if there are existing bookings in a top-level collection
    const oldBookingsRef = collection(db, 'bookings');
    const oldBookingsSnapshot = await getDocs(oldBookingsRef);
    
    // Check if there are any bookings to migrate
    if (oldBookingsSnapshot.empty) {
      console.log('No bookings to migrate');
      return;
    }
    
    // Migrate each booking to the user's subcollection
    for (const oldBookingDoc of oldBookingsSnapshot.docs) {
      const data = oldBookingDoc.data();
      const userId = data.userId;
      
      // Skip if no userId (shouldn't happen, but just in case)
      if (!userId) continue;
      
      // Create the booking in the user's subcollection
      const userBookingsRef = collection(db, 'users', userId, 'bookings');
      await addDoc(userBookingsRef, data);
      
      // Delete the old booking
      await deleteDoc(doc(db, 'bookings', oldBookingDoc.id));
    }
    
    console.log('Booking migration completed successfully');
  } catch (error) {
    console.error('Error migrating bookings:', error);
    toast.error('Failed to migrate bookings');
  }
};
