
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'visitor';

interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
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
          };
          
          if (userSnap.exists()) {
            // User exists in database
            const dbUser = userSnap.data();
            userData.role = dbUser.role || 'visitor';
          } else {
            // New user, create in database
            const role: UserRole = ADMIN_EMAILS.includes(firebaseUser.email || '') 
              ? 'admin' 
              : 'visitor';
              
            userData.role = role;
            
            await setDoc(userRef, {
              email: firebaseUser.email,
              role,
              createdAt: new Date()
            });
          }
          
          setUser(userData as AuthUser);
        } catch (error) {
          console.error("Error getting user data:", error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
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
        signOut,
        isAdmin: user?.role === 'admin'
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
