
import { User } from 'firebase/auth';

export type UserRole = 'admin' | 'visitor';

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
  phone?: string;
  displayName?: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>; // Changed from Promise<AuthUser> to Promise<void>
  signOut: () => Promise<void>;
  isAdmin: boolean;
  updateUserPhone: (phone: string) => Promise<void>;
  updateUserProfile: (data: { displayName?: string }) => Promise<void>;
  refreshUserData?: () => Promise<AuthUser | null>;
}
