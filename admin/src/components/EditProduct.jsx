import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../CSS/EditProduct.css";
import { url } from "../Url";
const EditProduct = () => {
  const { id } = useParams(); // Get the product ID from the URL parameters
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    original_price: "",
    current_price: "",
    discount_percentage: "",
    return_period: "",
    delivery_date: "",
    category: "",
    rating: {
      stars: 0,
      count: 0,
    },
  });
  const [image, setImage] = useState(null); // State to hold selected image

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${url}/api/products/${id}`);
        console.log(response.data); // Log fetched data for debugging
        setProduct(response.data);
        setFormData({
          name: response.data.item_name, // Map item_name to name for form
          original_price: response.data.original_price,
          current_price: response.data.current_price,
          discount_percentage: response.data.discount_percentage,
          return_period: response.data.return_period,
          delivery_date: response.data.delivery_date,
          category: response.data.category,
          rating: response.data.rating, // Set the rating details
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("rating.")) {
      const ratingField = name.split(".")[1]; // Get the field (stars or count)
      setFormData((prev) => ({
        ...prev,
        rating: {
          ...prev.rating,
          [ratingField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("item_name", formData.name); // Send item_name
    formDataToSend.append("original_price", formData.original_price);
    formDataToSend.append("current_price", formData.current_price);
    formDataToSend.append("discount_percentage", formData.discount_percentage);
    formDataToSend.append("return_period", formData.return_period);
    formDataToSend.append("delivery_date", formData.delivery_date);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("rating", JSON.stringify(formData.rating)); // Send rating as JSON string

    // Append the image file if one was selected
    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      await axios.put(`${url}/api/products/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type for file upload
        },
      });
      alert("Product updated successfully!");
      navigate("/admin"); // Redirect to manage products
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  return (
    <div className="edit-product">
      <h2 className="edit-product-title">Edit Product</h2>
      <Link to="/updateproduct" className="back-button-link">
        <button className="back-button">Back to Products</button>
      </Link>

      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="original_price">Original Price:</label>
          <input
            type="number"
            id="original_price"
            name="original_price"
            value={formData.original_price}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="current_price">Current Price:</label>
          <input
            type="number"
            id="current_price"
            name="current_price"
            value={formData.current_price}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="discount_percentage">Discount Percentage:</label>
          <input
            type="number"
            id="discount_percentage"
            name="discount_percentage"
            value={formData.discount_percentage}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="return_period">Return Period (days):</label>
          <input
            type="number"
            id="return_period"
            name="return_period"
            value={formData.return_period}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="delivery_date">Delivery Date:</label>
          <input
            type="text"
            id="delivery_date"
            name="delivery_date"
            value={formData.delivery_date}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating.stars">Rating Stars:</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            id="rating.stars"
            name="rating.stars"
            value={formData.rating.stars}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating.count">Rating Count:</label>
          <input
            type="number"
            id="rating.count"
            name="rating.count"
            value={formData.rating.count}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Product Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
