
import { db } from '@/config/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  serverTimestamp
} from 'firebase/firestore';
import { cars } from '@/data/cars';
import { initializeAdminUser } from './authService';

// Initialize app data
export const initializeAppData = async () => {
  try {
    console.log('Initializing app data...');
    
    // Initialize admin user
    await initializeAdminUser();
    
    // Initialize car data
    await initializeCarData();
    
    console.log('App data initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing app data:', error);
    throw error;
  }
};

// Initialize car data
const initializeCarData = async () => {
  try {
    // Check if cars collection exists
    const carsRef = collection(db, 'cars');
    const carsSnapshot = await getDocs(carsRef);
    
    if (carsSnapshot.empty) {
      console.log('Cars collection is empty, initializing with default data...');
      
      // Add each car from the default cars
      for (const car of cars) {
        const carRef = doc(db, 'cars', car.id);
        await setDoc(carRef, {
          ...car,
          createdAt: serverTimestamp()
        });
      }
      
      console.log('Default cars added successfully');
    } else {
      console.log('Cars collection already exists, skipping initialization');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing car data:', error);
    throw error;
  }
};

// Function to check user's bookings collection and create if it doesn't exist
export const initializeUserBookings = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        updatedAt: serverTimestamp()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing user bookings:', error);
    throw error;
  }
};
