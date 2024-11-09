// UpdateProduct.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../CSS/UpdateProduct.css";
import { url } from "../Url";
const UpdateProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="update-product">
      <h2 className="update-product-title">Update Product</h2>
      <Link to="/admin" className="back-button-link">
        <button className="back-button">Back to Manage Products</button>
      </Link>
      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <h3 className="select-product-title">Select a Product to Edit:</h3>
      <ul className="product-list">
        {filteredProducts.map((product) => (
          <li key={product._id} className="product-item">
            <Link to={`/edit-product/${product._id}`} className="product-link">
              <div className="product-card">
                <img
                  src={`${url}/images/${product.image}`}
                  alt={product.item_name}
                  className="product-image"
                />
                <h4 className="product-name">{product.item_name}</h4>
                <p className="product-category">Category: {product.category}</p>
                <p className="product-price">
                  Price: Rs.{product.current_price}
                </p>
                <p className="product-discount">
                  Discount: {product.discount_percentage}%
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpdateProduct;
