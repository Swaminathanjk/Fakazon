import express from "express";
import {
  placeOrder,
  getUserOrders,
  updateOrderStatus,
  updateOrderAddress,
  getallOrders
} from "../controllers/orderController.js";

const router = express.Router();

// Route for placing an order
router.post("/place-order", placeOrder);
  router.get("/", getallOrders);
// Route for getting user orders
router.get("/user-orders/:userId", getUserOrders);

// Route for updating order status (admin only)
router.patch("/update-status/:id", updateOrderStatus);

// Route for updating order address
router.put("/update-address", updateOrderAddress);

export default router; 
