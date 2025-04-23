
import { db } from '@/config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { BookingStatus } from '@/types/booking';
import { sendEmail } from '@/services/twilioService';
import { sendWhatsAppMessage } from '@/services/twilioService';

/**
 * Get all bookings in "pending" status across all users
 */
export const getPendingBookings = async (): Promise<any[]> => {
  try {
    // This is a complex query that requires a composite index in Firebase
    // For all users' bookings subcollections with pending status
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    const pendingBookings: any[] = [];
    
    // Fetch bookings for each user
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userBookingsRef = collection(db, 'users', userId, 'bookings');
      const q = query(userBookingsRef, where('basicInfo.status', '==', 'pending'));
      const bookingsSnapshot = await getDocs(q);
      
      bookingsSnapshot.docs.forEach(doc => {
        const bookingData = doc.data();
        pendingBookings.push({
          id: doc.id,
          userId: userId,
          ...bookingData,
          // Convert timestamps to dates for easier handling
          createdAt: bookingData.createdAt?.toDate?.() || new Date(),
          basicInfo: {
            ...bookingData.basicInfo,
            startDate: bookingData.basicInfo.startDate?.toDate?.() || new Date(bookingData.basicInfo.startDate),
            endDate: bookingData.basicInfo.endDate?.toDate?.() || new Date(bookingData.basicInfo.endDate)
          }
        });
      });
    }
    
    return pendingBookings;
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    throw error;
  }
};

/**
 * Accept a booking, update status to confirmed, and add to earnings
 */
export const acceptBooking = async (bookingId: string, userId: string): Promise<void> => {
  try {
    // 1. Update the booking status to confirmed
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      'basicInfo.status': BookingStatus.CONFIRMED,
      'updatedAt': serverTimestamp()
    });
    
    // 2. Get the booking data to create an earnings entry
    const bookingSnapshot = await getDocs(query(collection(db, 'users', userId, 'bookings'), where('__name__', '==', bookingId)));
    
    if (!bookingSnapshot.empty) {
      const bookingData = bookingSnapshot.docs[0].data();
      
      // 3. Create entry in Booking_Earnings collection
      await addDoc(collection(db, 'Booking_Earnings'), {
        bookingId: bookingId,
        userId: userId,
        date: bookingData.basicInfo.startDate,
        user: bookingData.contactInfo?.name || 'Unknown',
        source: bookingData.basicInfo.startCity,
        destination: bookingData.basicInfo.endCity || 'Not specified',
        cost: bookingData.paymentInfo?.totalAmount || 0,
        offline: false,
        createdAt: serverTimestamp()
      });
      
      // 4. Send confirmation notifications
      if (bookingData.contactInfo) {
        const { email, phone, name } = bookingData.contactInfo;
        
        // Send email notification
        await sendEmail({
          to: [email],
          subject: 'Your booking has been confirmed!',
          body: `Dear ${name}, your booking (ID: ${bookingId}) has been confirmed. Thank you for choosing our service!`,
        });
        
        // Send WhatsApp notification if phone provided
        if (phone) {
          await sendWhatsAppMessage({
            to: phone,
            body: `Your booking (ID: ${bookingId}) has been confirmed! Thank you for choosing our service!`,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error accepting booking:", error);
    throw error;
  }
};

/**
 * Reject a booking, update status to cancelled, and process refund
 */
export const rejectBooking = async (bookingId: string, userId: string): Promise<void> => {
  try {
    // 1. Update the booking status to cancelled
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      'basicInfo.status': BookingStatus.CANCELLED,
      'updatedAt': serverTimestamp()
    });
    
    // 2. Get the booking data for notification
    const bookingSnapshot = await getDocs(query(collection(db, 'users', userId, 'bookings'), where('__name__', '==', bookingId)));
    
    if (!bookingSnapshot.empty) {
      const bookingData = bookingSnapshot.docs[0].data();
      
      // 3. Process refund (in a real app, this would call a payment processor API)
      if (bookingData.paymentInfo?.isPaid) {
        // Update payment info to reflect refund
        await updateDoc(bookingRef, {
          'paymentInfo.refunded': true,
          'paymentInfo.refundedAt': serverTimestamp(),
          'paymentInfo.refundAmount': bookingData.paymentInfo.totalAmount
        });
        
        // In real implementation: call payment gateway for refund processing
        console.log(`Processing refund for booking ${bookingId}`);
      }
      
      // 4. Send cancellation notifications
      if (bookingData.contactInfo) {
        const { email, phone, name } = bookingData.contactInfo;
        
        // Send email notification
        await sendEmail({
          to: [email],
          subject: 'Your booking has been cancelled',
          body: `Dear ${name}, unfortunately your booking (ID: ${bookingId}) has been cancelled. Any payment made will be refunded to your original payment method.`,
        });
        
        // Send WhatsApp notification if phone provided
        if (phone) {
          await sendWhatsAppMessage({
            to: phone,
            body: `Your booking (ID: ${bookingId}) has been cancelled. Any payment made will be refunded to your original payment method.`,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error rejecting booking:", error);
    throw error;
  }
};

/**
 * Get all bookings in "confirmed" status across all users
 */
export const getConfirmedBookings = async (): Promise<any[]> => {
  try {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    const confirmedBookings: any[] = [];
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userBookingsRef = collection(db, 'users', userId, 'bookings');
      const q = query(userBookingsRef, where('basicInfo.status', '==', 'confirmed'));
      const bookingsSnapshot = await getDocs(q);
      
      bookingsSnapshot.docs.forEach(doc => {
        const bookingData = doc.data();
        confirmedBookings.push({
          id: doc.id,
          userId: userId,
          ...bookingData,
          // Convert timestamps to dates
          createdAt: bookingData.createdAt?.toDate?.() || new Date(),
          basicInfo: {
            ...bookingData.basicInfo,
            startDate: bookingData.basicInfo.startDate?.toDate?.() || new Date(bookingData.basicInfo.startDate),
            endDate: bookingData.basicInfo.endDate?.toDate?.() || new Date(bookingData.basicInfo.endDate)
          }
        });
      });
    }
    
    return confirmedBookings;
  } catch (error) {
    console.error("Error fetching confirmed bookings:", error);
    throw error;
  }
};
