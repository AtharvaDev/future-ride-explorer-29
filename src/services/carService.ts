
import { db } from '@/config/firebase';
import { Car } from '@/data/cars';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy 
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
    const carsQuery = query(collection(db, CARS_COLLECTION));
    const querySnapshot = await getDocs(carsQuery);
    
    let car: Car | null = null;
    querySnapshot.forEach((doc) => {
      if (doc.id === id) {
        car = { id: doc.id, ...doc.data() } as Car;
      }
    });
    
    return car;
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
    const existingCars = await getAllCars();
    
    if (existingCars.length === 0) {
      // If no cars exist in Firestore, add the default ones
      const promises = defaultCars.map(car => {
        const carRef = doc(db, CARS_COLLECTION, car.id);
        return setDoc(carRef, car);
      });
      
      await Promise.all(promises);
      console.log("Default cars initialized in Firestore");
    }
  } catch (error) {
    console.error("Error initializing default cars:", error);
    throw error;
  }
};
