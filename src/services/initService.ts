
import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { defaultCars } from '@/data/cars';
import { migrateBookingsToUserSubcollections } from './bookingService';

// Initialize the app with default data
export const initializeAppData = async () => {
  await ensureAdminUser();
  await ensureCarData();
  
  // Migrate existing bookings to user subcollections (if needed)
  await migrateBookingsToUserSubcollections();
};

// Ensure the admin user exists
const ensureAdminUser = async () => {
  const adminEmail = 'admin@futureride.com';
  
  // Check if users collection exists and has the admin user
  const usersRef = collection(db, 'users');
  const adminQuery = query(usersRef, where('email', '==', adminEmail));
  
  const querySnapshot = await getDocs(adminQuery);
  
  if (querySnapshot.empty) {
    // Create admin user if it doesn't exist
    const adminUserId = 'admin123'; // Using a fixed ID for the admin user
    await setDoc(doc(db, 'users', adminUserId), {
      email: adminEmail,
      isAdmin: true,
      name: 'Admin User',
      createdAt: new Date()
    });
    
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
};

// Ensure car data exists
const ensureCarData = async () => {
  const carsRef = collection(db, 'cars');
  const carsSnapshot = await getDocs(carsRef);
  
  // If we have no cars, add the default ones
  if (carsSnapshot.empty) {
    for (const car of defaultCars) {
      await addDoc(carsRef, car);
    }
    console.log('Default car data added successfully');
  } else {
    console.log('Car data already exists');
  }
};

// Helper function to ensure a user document exists
export const ensureUserExists = async (userId: string, userData: any) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // Create the user document if it doesn't exist
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date()
    });
    console.log(`User ${userId} created successfully`);
    return true;
  }
  
  return false;
};
