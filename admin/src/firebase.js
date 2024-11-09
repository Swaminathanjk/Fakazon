// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGAkHpsjicPzWytigRMXnNPjhMgdurKX0",
  authDomain: "amaclone-admin.firebaseapp.com",
  projectId: "amaclone-admin",
  storageBucket: "amaclone-admin.firebasestorage.app",
  messagingSenderId: "1035508309283",
  appId: "1:1035508309283:web:833b1868787b3d7e4e8096",
  measurementId: "G-KC1GLW3ZNK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
