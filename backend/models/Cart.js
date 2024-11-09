// models/Cart.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // Change from ObjectId to String
    required: true,
    unique: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, // This is the reference to Product
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
});

export const Cart = mongoose.model("Cart", cartSchema);
