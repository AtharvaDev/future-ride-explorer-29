
import { db } from '@/config/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy, Timestamp, DocumentData, deleteDoc, updateDoc } from 'firebase/firestore';
import { Car } from '@/data/cars';
import { getCarById } from './carService';
import { formatBookingDate } from '@/utils/bookingUtils';
import { BookingStatus, CompleteBookingData, UserBooking } from '@/types/booking';

// Get all bookings for a user
export const getBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    console.log("Fetching bookings for userId:", userId);
    
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.docs.length} bookings for user ${userId}`);
    
    const bookingsPromises = querySnapshot.docs.map(async (doc) => {
      const bookingData = doc.data() as UserBooking;
      const car = await getCarById(bookingData.carId);
      
      if (!car) {
        console.error(`Car with ID ${bookingData.carId} not found for booking ${doc.id}`);
        return null;
      }
      
      return {
        id: doc.id,
        ...bookingData,
        car,
        startDate: bookingData.startDate instanceof Timestamp ? 
          bookingData.startDate.toDate() : new Date(bookingData.startDate),
        endDate: bookingData.endDate instanceof Timestamp ? 
          bookingData.endDate.toDate() : new Date(bookingData.endDate)
      } as CompleteBookingData;
    });
    
    const bookings = await Promise.all(bookingsPromises);
    return bookings.filter(booking => booking !== null) as CompleteBookingData[];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

// Get active (current and future) bookings for a user
export const getActiveBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    console.log("Fetching active bookings for userId:", userId);
    const now = new Date();
    
    // Get all bookings first
    const allBookings = await getBookingsByUserId(userId);
    
    // Filter for active bookings (end date is in the future or booking is in progress)
    const activeBookings = allBookings.filter(booking => {
      const endDate = booking.endDate instanceof Timestamp ? 
        booking.endDate.toDate() : new Date(booking.endDate);
      return endDate >= now && booking.status !== BookingStatus.CANCELLED;
    });
    
    console.log(`Found ${activeBookings.length} active bookings for user ${userId}`);
    return activeBookings;
  } catch (error) {
    console.error("Error fetching active bookings:", error);
    throw error;
  }
};

// Get past bookings for a user
export const getPastBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    console.log("Fetching past bookings for userId:", userId);
    const now = new Date();
    
    // Get all bookings first
    const allBookings = await getBookingsByUserId(userId);
    
    // Filter for past bookings (end date is in the past or booking is cancelled)
    const pastBookings = allBookings.filter(booking => {
      const endDate = booking.endDate instanceof Timestamp ? 
        booking.endDate.toDate() : new Date(booking.endDate);
      return endDate < now || booking.status === BookingStatus.CANCELLED;
    });
    
    console.log(`Found ${pastBookings.length} past bookings for user ${userId}`);
    return pastBookings;
  } catch (error) {
    console.error("Error fetching past bookings:", error);
    throw error;
  }
};

// Get booking by ID with car details
export const getBookingById = async (bookingId: string): Promise<CompleteBookingData | null> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      console.log(`No booking found with ID: ${bookingId}`);
      return null;
    }
    
    const bookingData = bookingSnap.data() as UserBooking;
    const car = await getCarById(bookingData.carId);
    
    if (!car) {
      console.error(`Car with ID ${bookingData.carId} not found for booking ${bookingId}`);
      return null;
    }
    
    return {
      id: bookingId,
      carId: bookingData.carId,
      startDate: bookingData.startDate instanceof Timestamp ? 
        bookingData.startDate.toDate() : new Date(bookingData.startDate),
      endDate: bookingData.endDate instanceof Timestamp ? 
        bookingData.endDate.toDate() : new Date(bookingData.endDate),
      startCity: bookingData.startCity,
      status: bookingData.status,
      car: {
        id: car.id,
        title: car.title,
        image: car.image,
        pricePerDay: car.pricePerDay
      },
      paymentInfo: bookingData.paymentInfo,
      userId: bookingData.userId
    };
  } catch (error) {
    console.error(`Error fetching booking ${bookingId}:`, error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: BookingStatus.CANCELLED,
      updatedAt: Timestamp.now()
    });
    console.log(`Booking ${bookingId} has been cancelled`);
  } catch (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error);
    throw error;
  }
};

// Delete a booking (admin only)
export const deleteBooking = async (bookingId: string): Promise<void> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await deleteDoc(bookingRef);
    console.log(`Booking ${bookingId} has been deleted from the database`);
  } catch (error) {
    console.error(`Error deleting booking ${bookingId}:`, error);
    throw error;
  }
};
