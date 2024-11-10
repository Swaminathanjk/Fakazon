// routes/cartRoutes.js
import express from "express";
import {
  getCart,
  addToCart,
  clearCart,
  removeCartItem,
  updateCartItem,
  // getCartCount 
} from "../controllers/cartController.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyFirebaseToken, getCart); // Fetch cart for the logged-in user
router.post("/add", verifyFirebaseToken, addToCart); // Add item to cart
router.delete("/clear", verifyFirebaseToken, clearCart); // Clear the entire cart
router.delete("/remove/:productId", verifyFirebaseToken, removeCartItem); // Remove item from cart by productId
router.patch("/update", verifyFirebaseToken, updateCartItem); // Update cart item quantity
export default router;
