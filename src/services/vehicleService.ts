
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
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export interface Vehicle {
  id?: string;
  nickName: string;
  model: string;
  registrationNumber: string;
  createdAt?: Date | Timestamp;
}

/**
 * Get all vehicles
 */
export const getAllVehicles = async (): Promise<Vehicle[]> => {
  try {
    const vehiclesRef = collection(db, 'Vehicles');
    const q = query(vehiclesRef, orderBy('nickName', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nickName: data.nickName,
        model: data.model,
        registrationNumber: data.registrationNumber,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
      };
    });
  } catch (error) {
    console.error("Error getting vehicles:", error);
    throw error;
  }
};

/**
 * Add a new vehicle
 */
export const addVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<string> => {
  try {
    // Check if a vehicle with the same nickname already exists
    const vehiclesRef = collection(db, 'Vehicles');
    const q = query(vehiclesRef, where('nickName', '==', vehicle.nickName));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      throw new Error(`Vehicle with nickname "${vehicle.nickName}" already exists.`);
    }
    
    const vehicleData = {
      ...vehicle,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'Vehicles'), vehicleData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding vehicle:", error);
    throw error;
  }
};

/**
 * Update an existing vehicle
 */
export const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<void> => {
  try {
    if (updates.nickName) {
      // Check if another vehicle with the same nickname already exists
      const vehiclesRef = collection(db, 'Vehicles');
      const q = query(
        vehiclesRef, 
        where('nickName', '==', updates.nickName)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty && snapshot.docs[0].id !== id) {
        throw new Error(`Another vehicle with nickname "${updates.nickName}" already exists.`);
      }
    }
    
    const vehicleRef = doc(db, 'Vehicles', id);
    await updateDoc(vehicleRef, updates);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
};

/**
 * Delete a vehicle
 */
export const deleteVehicle = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'Vehicles', id));
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
};
