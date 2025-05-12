
import { db } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import { Review } from '@/types/review';

/**
 * Get all reviews
 */
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, 'Reviews');
    const q = query(reviewsRef, orderBy('displayOrder', 'asc'), orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        name: data.name,
        rating: data.rating,
        text: data.text,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        displayOrder: data.displayOrder || 0
      };
    });
  } catch (error) {
    console.error("Error getting reviews:", error);
    throw error;
  }
};

/**
 * Add a new review
 */
export const addReview = async (review: Omit<Review, 'id'>): Promise<string> => {
  try {
    const reviewData = {
      ...review,
      createdAt: serverTimestamp(),
      displayOrder: review.displayOrder || 9999 // Default to a high number if not specified
    };
    
    const docRef = await addDoc(collection(db, 'Reviews'), reviewData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

/**
 * Update an existing review
 */
export const updateReview = async (id: string, updates: Partial<Review>): Promise<void> => {
  try {
    const reviewRef = doc(db, 'Reviews', id);
    await updateDoc(reviewRef, updates);
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

/**
 * Delete a review
 */
export const deleteReview = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'Reviews', id));
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

/**
 * Update the display order of multiple reviews
 */
export const updateReviewsOrder = async (orderedReviews: { id: string; displayOrder: number }[]): Promise<void> => {
  try {
    const batch = db.batch();
    
    orderedReviews.forEach(item => {
      const reviewRef = doc(db, 'Reviews', item.id);
      batch.update(reviewRef, { displayOrder: item.displayOrder });
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error updating reviews order:", error);
    throw error;
  }
};
