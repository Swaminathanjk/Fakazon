// middleware/authMiddleware.js
import { getAuth } from "firebase-admin/auth";

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or invalid" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = { uid: decodedToken.uid };
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
