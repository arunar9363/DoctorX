// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged, // Added this import
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPIU6Z7vfbRGtQOv9IXxZ5phcJReoW5Y0",
  authDomain: "doctorx-ee861.firebaseapp.com",
  projectId: "doctorx-ee861",
  storageBucket: "doctorx-ee861.appspot.com", // fixed earlier
  messagingSenderId: "902137880506",
  appId: "1:902137880506:web:25d30dac147ee0b1978783",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged // Added this export
};