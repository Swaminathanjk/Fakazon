import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../controllers/productController.js";

const storage = multer.diskStorage({
  destination: "uploads", // Save uploaded images to 'uploads' directory
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();



router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

router.get("/images", (req, res) => {
  const imagesDirectory = path.join(__dirname, "../uploads");
  fs.readdir(imagesDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Failed to read directory" });
    }
    // Filter for image files (you can modify this based on your needs)
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/.test(file)
    );
    res.json(imageFiles);
  });
});

export default router;
