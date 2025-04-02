
import { db } from '@/config/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy, Timestamp, DocumentData, deleteDoc, updateDoc } from 'firebase/firestore';
import { Car } from '@/data/cars';
import { getCarById } from './carService';
import { ensureDate } from '@/utils/bookingUtils';
import { BookingStatus, CompleteBookingData, BookingData } from '@/types/booking';

// Get all bookings for a user
export const getBookingsByUserId = async (userId: string): Promise<CompleteBookingData[]> => {
  try {
    console.log("Fetching bookings for userId:", userId);
    
    // Updated to use the subcollection structure
    const bookingsRef = collection(db, `users/${userId}/bookings`);
    const q = query(
      bookingsRef, 
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.docs.length} bookings for user ${userId}`);
    
    const bookingsPromises = querySnapshot.docs.map(async (doc) => {
      const bookingData = doc.data() as BookingData;
      
      // If the car data is already in the document, use it directly
      let car;
      if (bookingData.car) {
        car = bookingData.car;
      } else if (bookingData.carId || bookingData.basicInfo?.carId) {
        const carId = bookingData.carId || bookingData.basicInfo?.carId;
        if (carId) {
          car = await getCarById(carId);
        }
      }
      
      if (!car) {
        console.error(`Car not found for booking ${doc.id}`);
        return null;
      }

      // Handle both data structures (nested under basicInfo or flat)
      const startDate = bookingData.startDate 
        ? bookingData.startDate instanceof Timestamp 
          ? bookingData.startDate.toDate() 
          : new Date(bookingData.startDate)
        : bookingData.basicInfo?.startDate instanceof Timestamp 
          ? bookingData.basicInfo.startDate.toDate() 
          : new Date(bookingData.basicInfo?.startDate);
      
      const endDate = bookingData.endDate 
        ? bookingData.endDate instanceof Timestamp 
          ? bookingData.endDate.toDate() 
          : new Date(bookingData.endDate)
        : bookingData.basicInfo?.endDate instanceof Timestamp 
          ? bookingData.basicInfo.endDate.toDate() 
          : new Date(bookingData.basicInfo?.endDate);
      
      const status = bookingData.status || bookingData.basicInfo?.status;
      const startCity = bookingData.startCity || bookingData.basicInfo?.startCity;
      
      return {
        id: doc.id,
        carId: bookingData.carId || bookingData.basicInfo?.carId || '',
        startDate,
        endDate,
        startCity,
        status,
        car,
        paymentInfo: bookingData.paymentInfo,
        userId
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
export const getBookingById = async (bookingId: string, userId: string): Promise<CompleteBookingData | null> => {
  try {
    // Updated path to use userId parameter
    const bookingRef = doc(db, `users/${userId}/bookings`, bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      console.log(`No booking found with ID: ${bookingId}`);
      return null;
    }
    
    const bookingData = bookingSnap.data() as BookingData;
    
    // If car data is directly stored in the booking
    let car = bookingData.car;
    
    // If not, fetch it
    if (!car && (bookingData.carId || bookingData.basicInfo?.carId)) {
      const carId = bookingData.carId || bookingData.basicInfo?.carId;
      if (carId) {
        car = await getCarById(carId);
      }
    }
    
    if (!car) {
      console.error(`Car not found for booking ${bookingId}`);
      return null;
    }
    
    // Extract data with fallbacks for both data structures
    const startDate = bookingData.startDate 
      ? bookingData.startDate instanceof Timestamp 
        ? bookingData.startDate.toDate() 
        : new Date(bookingData.startDate)
      : bookingData.basicInfo?.startDate instanceof Timestamp 
        ? bookingData.basicInfo.startDate.toDate() 
        : new Date(bookingData.basicInfo?.startDate);
    
    const endDate = bookingData.endDate 
      ? bookingData.endDate instanceof Timestamp 
        ? bookingData.endDate.toDate() 
        : new Date(bookingData.endDate)
      : bookingData.basicInfo?.endDate instanceof Timestamp 
        ? bookingData.basicInfo.endDate.toDate() 
        : new Date(bookingData.basicInfo?.endDate);
    
    return {
      id: bookingId,
      carId: bookingData.carId || bookingData.basicInfo?.carId || '',
      startDate,
      endDate,
      startCity: bookingData.startCity || bookingData.basicInfo?.startCity || '',
      status: bookingData.status || bookingData.basicInfo?.status || BookingStatus.DRAFT,
      car: {
        id: car.id,
        title: car.title,
        image: car.image,
        pricePerDay: car.pricePerDay
      },
      paymentInfo: bookingData.paymentInfo,
      userId: bookingData.userId || bookingData.basicInfo?.userId || userId
    };
  } catch (error) {
    console.error(`Error fetching booking ${bookingId}:`, error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string, userId: string): Promise<void> => {
  try {
    // Updated to use userId parameter
    const bookingRef = doc(db, `users/${userId}/bookings`, bookingId);
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
export const deleteBooking = async (bookingId: string, userId: string): Promise<void> => {
  try {
    // Updated to use userId parameter
    const bookingRef = doc(db, `users/${userId}/bookings`, bookingId);
    await deleteDoc(bookingRef);
    console.log(`Booking ${bookingId} has been deleted from the database`);
  } catch (error) {
    console.error(`Error deleting booking ${bookingId}:`, error);
    throw error;
  }
};
