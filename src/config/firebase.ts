
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBGMHmWtPbwzH4lFPiOJbxTjkgQxMoPo9I",
  authDomain: "car-rental-demo-app.firebaseapp.com",
  projectId: "car-rental-demo-app",
  storageBucket: "car-rental-demo-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
