
import { Timestamp } from 'firebase/firestore';

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
export const convertTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

/**
 * Check if a value is a Firestore Timestamp and convert it to Date if it is
 */
export const ensureDate = (value: Timestamp | Date): Date => {
  return value instanceof Timestamp ? convertTimestampToDate(value) : value;
};

/**
 * Format a date or timestamp into a readable string
 */
export const formatBookingDate = (date: Date | Timestamp): string => {
  const dateObject = date instanceof Timestamp ? date.toDate() : date;
  return dateObject.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
