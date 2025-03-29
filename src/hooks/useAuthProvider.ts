
import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { AuthUser } from '@/types/auth';
import { getUserFromFirebase, updatePhoneNumber, updateProfile } from '@/utils/authUtils';
import { toast } from 'sonner';

export const useAuthProvider = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserFromFirebase(firebaseUser);
        setUser(userData);
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
    
    await updatePhoneNumber(user.uid, phone);
    
    // Update local user state
    setUser({
      ...user,
      phone
    });
  };

  const updateUserProfile = async (data: { displayName?: string }) => {
    if (!user || !auth.currentUser) {
      throw new Error('No user is logged in');
    }
    
    try {
      // Update Firebase Auth profile
      if (data.displayName) {
        await firebaseUpdateProfile(auth.currentUser, { displayName: data.displayName });
      }
      
      await updateProfile(user.uid, auth.currentUser, data);
      
      // Update local state
      setUser({
        ...user,
        ...data
      });
    } catch (error) {
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
      const userData = await getUserFromFirebase(result.user);
      setUser(userData);
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

  return {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signOut,
    isAdmin: user?.role === 'admin',
    updateUserPhone,
    updateUserProfile
  };
};
