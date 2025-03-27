
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAA1rXy0rdsq-I6JS18dOxqeX_Ba0DlyCs",
  authDomain: "chauffeur-driven-car.firebaseapp.com",
  projectId: "chauffeur-driven-car",
  storageBucket: "chauffeur-driven-car.firebasestorage.app",
  messagingSenderId: "116391754783",
  appId: "1:116391754783:web:2a37c4663c05efb434e92a",
  measurementId: "G-ZFWSFCHY50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
