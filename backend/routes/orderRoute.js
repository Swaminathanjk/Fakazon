import express from "express";
import {
  placeOrder,
  getUserOrders,
  updateOrderStatus,
  updateOrderAddress,
} from "../controllers/orderController.js";

const router = express.Router();

// Route for placing an order
router.post("/place-order", placeOrder);

// Route for getting user orders
router.get("/user-orders/:userId", getUserOrders);

// Route for updating order status (admin only)
router.put("/update-status", updateOrderStatus);

// Route for updating order address
router.put("/update-address", updateOrderAddress);

export default router;
