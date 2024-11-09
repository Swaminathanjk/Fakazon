// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";
import "dotenv/config";
import axios from "axios"; // Import axios for HTTP requests
import { deleteUserFromFirebase } from "./config/firebaseAdmin.js"; // Import the deleteUser function

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);

// Custom route to delete user from Firebase and MongoDB


// Serve static files from the uploads directory for images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API Working");
});

// Start the server
app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
