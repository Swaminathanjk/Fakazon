// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Auth
import { getFirestore } from "firebase/firestore"; // If using Firestore

const firebaseConfig = {
// your firebase Config from Firebase console
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Auth
const db = getFirestore(app); // Initialize Firestore (if needed)

export { app, auth, db }; // Export the initialized services
 
// test