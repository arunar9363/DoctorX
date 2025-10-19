// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
// --- 1. IMPORT getFirestore ---
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPIU6Z7vfbRGtQOv9IXxZ5phcJReoW5Y0",
  authDomain: "doctorx-ee861.firebaseapp.com",
  projectId: "doctorx-ee861",
  storageBucket: "doctorx-ee861.appspot.com",
  messagingSenderId: "902137880506",
  appId: "1:902137880506:web:25d30dac147ee0b1978783",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- 2. INITIALIZE FIRESTORE ---
const db = getFirestore(app);

// --- 3. EXPORT db ALONG WITH EVERYTHING ELSE ---
export {
  auth,
  db, // Add db to the export list
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
