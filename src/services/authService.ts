
import { db, auth } from '@/config/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { UserRole } from '@/contexts/AuthContext';

// Create admin user if it doesn't exist
export const initializeAdminUser = async () => {
  try {
    // Check if admin user already exists
    const adminEmail = 'admin@futureride.com';
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', adminEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Admin user does not exist, creating...');
      
      try {
        // Create admin user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, 'password123');
        const uid = userCredential.user.uid;
        
        // Create admin user document in Firestore
        await setDoc(doc(db, 'users', uid), {
          email: adminEmail,
          role: 'admin' as UserRole,
          createdAt: serverTimestamp()
        });
        
        console.log('Admin user created successfully');
        return true;
      } catch (authError: any) {
        // If user already exists in Auth but not in Firestore
        if (authError.code === 'auth/email-already-in-use') {
          console.log('Admin user exists in Auth but not in Firestore, fetching user...');
          // We need to get the UID for this user
          const adminUsersQuery = query(
            collection(db, 'users'),
            where('email', '==', adminEmail)
          );
          const adminSnapshot = await getDocs(adminUsersQuery);
          
          if (adminSnapshot.empty) {
            // No user document exists, we need to create it
            // This is a rare edge case
            console.log('Creating admin user document...');
            // We would need the UID, but we can't get it without signing in
            // In a real app, you would handle this differently
            return false;
          }
        } else {
          console.error('Error creating admin user:', authError);
          return false;
        }
      }
    } else {
      console.log('Admin user already exists');
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing admin user:', error);
    return false;
  }
};
