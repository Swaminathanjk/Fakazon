import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../CSS/AddProducts.css";
import { url } from "../Url";
const AddProducts = () => {
  const [productName, setProductName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [returnPeriod, setReturnPeriod] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [ratingStars, setRatingStars] = useState("");
  const [ratingCount, setRatingCount] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      setPreviewUrl(URL.createObjectURL(file));
      // Optionally handle resizing if necessary
      setImage(file);
    }
  };

  console.log(url);

  const resizeImage = (file, width, height) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject(new Error("Image resizing failed"));
            }
          }, file.type);
        };

        img.onerror = (error) => reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("item_name", productName);
    formData.append("original_price", originalPrice);
    formData.append("company", companyName);
    formData.append("current_price", currentPrice);
    formData.append("discount_percentage", discountPercentage);
    formData.append("return_period", returnPeriod);
    formData.append("delivery_date", deliveryDate); // This should be in "DD MMM YYYY" format
    formData.append("category", category);
    formData.append(
      "rating",
      JSON.stringify({ stars: ratingStars, count: ratingCount })
    );
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(`${url}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="manage-products">
      <h2 className="form-title">Add New Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            className="form-input"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            className="form-input"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="originalPrice">Original Price:</label>
          <input
            type="number"
            id="originalPrice"
            className="form-input"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="currentPrice">Current Price:</label>
          <input
            type="number"
            id="currentPrice"
            className="form-input"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="discountPercentage">Discount Percentage:</label>
          <input
            type="number"
            id="discountPercentage"
            className="form-input"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="returnPeriod">Return Period:</label>
          <input
            type="text"
            id="returnPeriod"
            className="form-input"
            value={returnPeriod}
            onChange={(e) => setReturnPeriod(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deliveryDate">
            Delivery Date (e.g., DD Nov YYYY):
          </label>
          <input
            type="text"
            id="deliveryDate"
            className="form-input"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            placeholder="13 Nov 2023"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            className="form-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ratingStars">Rating Stars:</label>
          <input
            type="number"
            id="ratingStars"
            className="form-input"
            value={ratingStars}
            step={0.1}
            onChange={(e) => setRatingStars(e.target.value)}
            required
            min="0"
            max="5"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ratingCount">Rating Count:</label>
          <input
            type="number"
            id="ratingCount"
            className="form-input"
            value={ratingCount}
            onChange={(e) => setRatingCount(e.target.value)}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            className="form-input"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
        </div>

        {previewUrl && (
          <div className="image-preview">
            <img src={previewUrl} alt="Image Preview" />
          </div>
        )}

        <button type="submit" className="submit-button">
          Add Product
        </button>
      </form>
      <Link to="/admin">
        <button className="back-button">Back to Manage Products</button>
      </Link>
    </div>
  );
};

export default AddProducts;
