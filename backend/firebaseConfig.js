// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Auth
import { getFirestore } from "firebase/firestore"; // If using Firestore

const firebaseConfig = {
  apiKey: "AIzaSyA6rWUIQv29Osh0pQ7TYpojI5Ox1YR9Qyo",
  authDomain: "vite-19f02.firebaseapp.com",
  projectId: "vite-19f02",
  storageBucket: "vite-19f02.firebasestorage.app",
  messagingSenderId: "375744926594",
  appId: "1:375744926594:web:e602b5e4e4d4d03470b59b",
  measurementId: "G-1T2CX4C210",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Auth
const db = getFirestore(app); // Initialize Firestore (if needed)

export { app, auth, db }; // Export the initialized services
