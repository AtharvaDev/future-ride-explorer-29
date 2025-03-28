
import { initializeDefaultCars } from './carService';
import { initializeAdminUser } from './authService';
import { cars as defaultCars } from "@/data/cars";

export const initializeAppData = async () => {
  try {
    console.log("Setting up Firebase with default data...");
    
    // Initialize default cars
    await initializeDefaultCars(defaultCars);
    
    // Initialize admin user
    await initializeAdminUser();
    
    console.log("Firebase setup complete!");
    return true;
  } catch (error) {
    console.error("Error initializing app data:", error);
    throw error;
  }
};
