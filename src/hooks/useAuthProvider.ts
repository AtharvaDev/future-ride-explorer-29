import { auth, db } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  AuthError,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  DocumentData,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";
import { UserRole, AuthUser } from "@/contexts/AuthContext";
import { sendNewUserSignupNotification } from '@/services/notificationService';

export function useAuthProvider() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();

        const isAdmin = userData?.role === "admin";
        setIsAdmin(isAdmin);

        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
          phone: userData?.phone || "",
          role: userData?.role || "user",
          metadata: {
            creationTime: firebaseUser.metadata.creationTime || "",
            lastSignInTime: firebaseUser.metadata.lastSignInTime || "",
          }
        };

        setUser(authUser);

        const isNewUser = !userData;
        
        await setDoc(
          doc(db, "users", firebaseUser.uid),
          {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: userData?.role || "user",
            lastLogin: serverTimestamp(),
            ...(isNewUser && { createdAt: serverTimestamp() }),
          },
          { merge: true }
        );
        
        if (isNewUser) {
          try {
            await sendNewUserSignupNotification(authUser);
          } catch (error) {
            console.error("Error sending new user notification:", error);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
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
      if (data.displayName) {
        await firebaseUpdateProfile(auth.currentUser, { displayName: data.displayName });
      }
      
      await updateProfile(user.uid, auth.currentUser, data);
      
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
      const result = await signInWithPopup(auth, GoogleAuthProvider);
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
      await signOut(auth);
      toast.success("Successfully logged out!");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (!user || !auth.currentUser) return null;
    
    try {
      setLoading(true);
      const userData = await getUserFromFirebase(auth.currentUser);
      setUser(userData);
      setLoading(false);
      return userData;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      setLoading(false);
      return null;
    }
  };

  return {
    user,
    loading,
    isAdmin,
    signIn,
    signInWithGoogle,
    signOut,
    updateUserPhone,
    updateUserProfile,
    refreshUserData
  };
}
