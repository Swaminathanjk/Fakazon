import express from "express";
import {
  createUser,
  getUser,
  getUserfromId,
  deleteUser,
  updateUser,
  updateAddress,
} from "../controllers/userController.js";

const router = express.Router();

// Route to create or update a user
router.post("/", createUser);
router.get("/", getUser);

// Route to fetch a user by UID
router.get("/:uid", getUserfromId);
router.delete("/:uid", deleteUser);
router.patch("/:uid", updateUser);
router.post("/updateAddress", updateAddress);

export default router;
