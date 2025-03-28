
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  User,
  updateProfile
} from 'firebase/auth';
import { auth, db, googleProvider } from '@/config/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'sonner';
import { initializeUserBookings } from '@/services/initService';

export type UserRole = 'admin' | 'visitor';

interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
  phone?: string;
  displayName?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  updateUserPhone: (phone: string) => Promise<void>;
  updateUserProfile: (data: { displayName?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// List of admin emails - in a real app, this would be stored in the database
const ADMIN_EMAILS = [
  'admin@futureride.com',
  'admin@example.com'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in the database
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          let userData: Partial<AuthUser> = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName
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
          }
          
          // Initialize user's bookings collection
          await initializeUserBookings(firebaseUser.uid);
          
          setUser(userData as AuthUser);
        } catch (error) {
          console.error("Error getting user data:", error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: 'visitor' // Default role
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserPhone = async (phone: string) => {
    if (!user) {
      throw new Error('No user is logged in');
    }
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { phone }, { merge: true });
      
      // Update local user state
      setUser({
        ...user,
        phone
      });
      
      toast.success('Phone number updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update phone number');
      throw error;
    }
  };

  const updateUserProfile = async (data: { displayName?: string }) => {
    if (!user || !auth.currentUser) {
      throw new Error('No user is logged in');
    }
    
    try {
      // Update Firebase Auth profile
      if (data.displayName) {
        await updateProfile(auth.currentUser, { displayName: data.displayName });
      }
      
      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, data, { merge: true });
      
      // Update local state
      setUser({
        ...user,
        ...data
      });
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully logged in!");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in the database
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // New user, create in database
        const role: UserRole = ADMIN_EMAILS.includes(user.email || '') 
          ? 'admin' 
          : 'visitor';
          
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          role,
          createdAt: new Date()
        });
      }
      
      // Initialize user's bookings collection
      await initializeUserBookings(user.uid);
      
      toast.success("Successfully logged in with Google!");
    } catch (error: any) {
      toast.error(error.message || "Failed to login with Google");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      toast.success("Successfully logged out!");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading,
        signIn,
        signInWithGoogle,
        signOut,
        isAdmin: user?.role === 'admin',
        updateUserPhone,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
