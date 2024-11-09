// config/firebaseAdmin.js
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" }; // Make sure this file is in the correct location

// Initialize Firebase Admin SDK with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export deleteUser function to delete user from Firebase Authentication
export const deleteUserFromFirebase = async (uid) => {
  try {
    await admin.auth().deleteUser(uid);
    admin.firestore().collection('users').doc(uid).delete()
    console.log(`User with UID ${uid} deleted from Firebase`);
  } catch (error) {
    console.error(`Error deleting user from Firebase: ${error.message}`);
    throw new Error("Error deleting user from Firebase");
  }
};
