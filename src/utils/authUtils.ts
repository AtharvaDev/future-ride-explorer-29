
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { AuthUser, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { initializeUserBookings } from '@/services/initService';

// List of admin emails - in a real app, this would be stored in the database
export const ADMIN_EMAILS = [
  'admin@futureride.com',
  'admin@example.com'
];

export const getUserFromFirebase = async (firebaseUser: User): Promise<AuthUser | null> => {
  if (!firebaseUser) return null;
  
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    let userData: Partial<AuthUser> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    };
    
    if (userSnap.exists()) {
      // User exists in database
      const dbUser = userSnap.data();
      userData.role = dbUser.role || 'visitor';
      userData.phone = dbUser.phone;
    } else {
      // New user, create in database
      const role: UserRole = ADMIN_EMAILS.includes(firebaseUser.email || '') 
        ? 'admin' 
        : 'visitor';
        
      userData.role = role;
      
      await setDoc(userRef, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role,
        createdAt: new Date()
      });

      toast.success("Welcome to FutureRide! Your account has been created.");
    }
    
    // Initialize user's bookings collection
    await initializeUserBookings(firebaseUser.uid);
    
    return userData as AuthUser;
  } catch (error) {
    console.error("Error getting user data:", error);
    toast.error("Failed to load user data. Please try again.");
    
    // Return basic user info even if there's an error
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      role: 'visitor' // Default role
    };
  }
};

export const updatePhoneNumber = async (userId: string, phone: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { phone }, { merge: true });
    toast.success('Phone number updated successfully');
  } catch (error: any) {
    toast.error(error.message || 'Failed to update phone number');
    throw error;
  }
};

export const updateProfile = async (
  userId: string, 
  data: { displayName?: string }
): Promise<void> => {
  try {
    // Update Firestore
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, data, { merge: true });
    
    toast.success('Profile updated successfully');
  } catch (error: any) {
    toast.error(error.message || 'Failed to update profile');
    throw error;
  }
};
