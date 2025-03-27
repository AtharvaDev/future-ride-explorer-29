
import { db } from '@/config/firebase';
import { Car } from '@/data/cars';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy,
  getDoc
} from 'firebase/firestore';

const CARS_COLLECTION = 'cars';

// Get all cars from Firestore
export const getAllCars = async (): Promise<Car[]> => {
  try {
    const carsQuery = query(collection(db, CARS_COLLECTION), orderBy('model'));
    const querySnapshot = await getDocs(carsQuery);
    
    const cars: Car[] = [];
    querySnapshot.forEach((doc) => {
      cars.push({ id: doc.id, ...doc.data() } as Car);
    });
    
    return cars;
  } catch (error) {
    console.error("Error getting cars:", error);
    throw error;
  }
};

// Get a specific car by ID
export const getCarById = async (id: string): Promise<Car | null> => {
  try {
    const carRef = doc(db, CARS_COLLECTION, id);
    const carSnapshot = await getDoc(carRef);
    
    if (carSnapshot.exists()) {
      return { id: carSnapshot.id, ...carSnapshot.data() } as Car;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting car by ID:", error);
    throw error;
  }
};

// Add a new car or update an existing one
export const saveCar = async (car: Car): Promise<void> => {
  try {
    const carRef = doc(db, CARS_COLLECTION, car.id);
    await setDoc(carRef, car);
  } catch (error) {
    console.error("Error saving car:", error);
    throw error;
  }
};

// Delete a car by ID
export const deleteCar = async (id: string): Promise<void> => {
  try {
    const carRef = doc(db, CARS_COLLECTION, id);
    await deleteDoc(carRef);
  } catch (error) {
    console.error("Error deleting car:", error);
    throw error;
  }
};

// Initialize default cars in Firestore if they don't exist
export const initializeDefaultCars = async (defaultCars: Car[]): Promise<void> => {
  try {
    console.log("Checking if default cars need to be initialized...");
    
    // Check if collection exists and has data
    const carsQuery = query(collection(db, CARS_COLLECTION));
    const querySnapshot = await getDocs(carsQuery);
    
    if (querySnapshot.empty) {
      console.log("No cars found in Firestore, initializing default cars...");
      
      // If no cars exist in Firestore, add the default ones
      const promises = defaultCars.map(car => {
        // Clean up the car object by removing any undefined or non-serializable values
        const cleanCar = JSON.parse(JSON.stringify(car));
        const carRef = doc(db, CARS_COLLECTION, car.id);
        return setDoc(carRef, cleanCar);
      });
      
      await Promise.all(promises);
      console.log("Default cars successfully initialized in Firestore!");
    } else {
      console.log(`Found ${querySnapshot.size} cars in Firestore, skipping initialization.`);
    }
  } catch (error) {
    console.error("Error initializing default cars:", error);
    throw error;
  }
};
