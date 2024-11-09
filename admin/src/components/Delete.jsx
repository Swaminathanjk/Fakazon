import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS/Delete.css";
import { url } from "../Url";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${url}/api/products`);
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${url}/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== id)); // Update state
        alert("Product deleted successfully");
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting product");
    }
  };

  // Filter products based on the search query
  const filteredProducts = products.filter(
    (product) =>
      product.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Product List</h1>
      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Link to="/admin" className="back-button-link">
        <button className="back-button">Back to Manage Products</button>
      </Link>
      <ul className="product-list">
        {filteredProducts.map((product) => (
          <li key={product._id} className="product-item">
            <span className="product-name">
              {product.item_name} - {product.company}
            </span>
            <button
              className="delete-button"
              onClick={() => deleteProduct(product._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
