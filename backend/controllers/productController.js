import Product from "../models/Product.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    // Destructure the required fields from req.body
    const {
      company,
      item_name,
      category,
      original_price,
      current_price,
      discount_percentage,
      return_period,
      delivery_date,
      rating, // Expected to be a JSON string
    } = req.body;

    // Check if rating exists and is a valid JSON string before parsing
    const parsedRating = rating ? JSON.parse(rating) : { stars: 0, count: 0 };

    // Check if req.file is defined
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    // Create a new product instance
    const newProduct = new Product({
      company,
      item_name,
      category,
      original_price,
      current_price,
      discount_percentage,
      return_period,
      delivery_date,
      rating: parsedRating,
      image: req.file.filename, // Store the image filename if needed
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Respond with the saved product
    res.status(201).json({
      message: "Product created successfully!",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params; // Extract ID from request parameters
  try {
    const product = await Product.findById(id); // Find the product by ID
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product); // Respond with the found product
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ message: error.message }); // Handle errors
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = {
    company: req.body.company,
    item_name: req.body.item_name,
    category: req.body.category,
    original_price: req.body.original_price,
    current_price: req.body.current_price,
    discount_percentage: req.body.discount_percentage,
    return_period: req.body.return_period,
    delivery_date: req.body.delivery_date,
    rating: JSON.parse(req.body.rating), // Parse rating if needed
  };

  // Add new image if uploaded
  if (req.file) {
    updatedData.image = req.file.filename; // Assign the new image filename
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).send(); // No content response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
