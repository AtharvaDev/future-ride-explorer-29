
import { db } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';

export interface EarningEntry {
  id?: string;
  date: string | Date;
  user: string;
  source: string;
  destination: string;
  cost: number;
  offline: boolean;
  bookingId?: string;
  userId?: string;
  createdAt?: Date | Timestamp;
}

/**
 * Get all earnings entries
 */
export const getAllEarnings = async (): Promise<EarningEntry[]> => {
  try {
    const earningsRef = collection(db, 'Booking_Earnings');
    const q = query(earningsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
        user: data.user,
        source: data.source,
        destination: data.destination,
        cost: data.cost,
        offline: data.offline || false,
        bookingId: data.bookingId,
        userId: data.userId,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
      };
    });
  } catch (error) {
    console.error("Error getting earnings:", error);
    throw error;
  }
};

/**
 * Add a new earnings entry (typically for offline bookings)
 */
export const addEarning = async (earning: Omit<EarningEntry, 'id'>): Promise<string> => {
  try {
    // For offline entries, we don't have a bookingId or userId
    const earningData = {
      ...earning,
      date: earning.date instanceof Date ? Timestamp.fromDate(earning.date) : Timestamp.fromDate(new Date(earning.date)),
      offline: true,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'Booking_Earnings'), earningData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding earning:", error);
    throw error;
  }
};

/**
 * Update an existing earnings entry
 */
export const updateEarning = async (id: string, updates: Partial<EarningEntry>): Promise<void> => {
  try {
    const earningRef = doc(db, 'Booking_Earnings', id);
    
    const updateData: any = { ...updates };
    if (updates.date) {
      updateData.date = updates.date instanceof Date 
        ? Timestamp.fromDate(updates.date) 
        : Timestamp.fromDate(new Date(updates.date));
    }
    
    await updateDoc(earningRef, updateData);
  } catch (error) {
    console.error("Error updating earning:", error);
    throw error;
  }
};

/**
 * Delete an earnings entry
 */
export const deleteEarning = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'Booking_Earnings', id));
  } catch (error) {
    console.error("Error deleting earning:", error);
    throw error;
  }
};

/**
 * Get earnings in a date range
 */
export const getEarningsByDateRange = async (startDate: Date, endDate: Date): Promise<EarningEntry[]> => {
  try {
    const earningsRef = collection(db, 'Booking_Earnings');
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    
    const q = query(
      earningsRef, 
      where('date', '>=', startTimestamp), 
      where('date', '<=', endTimestamp),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
        user: data.user,
        source: data.source,
        destination: data.destination,
        cost: data.cost,
        offline: data.offline || false,
        bookingId: data.bookingId,
        userId: data.userId
      };
    });
  } catch (error) {
    console.error("Error getting earnings by date range:", error);
    throw error;
  }
};
