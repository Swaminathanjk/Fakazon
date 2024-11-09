import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    item_name: { type: String, required: true },
    category: { type: String, required: true },
    original_price: { type: Number, required: true },
    current_price: { type: Number, required: true },
    discount_percentage: { type: Number, required: true },
    return_period: { type: Number, required: true },
    delivery_date: { type: String, required: true },
    rating: {
      stars: { type: Number, required: false },
      count: { type: Number, required: false },
    },
    image: { type: String, required: false }, // Store image path
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
