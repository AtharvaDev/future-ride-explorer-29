
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
