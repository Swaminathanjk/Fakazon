// src/components/AdminPanel.js
import React from "react";
import { Link } from "react-router-dom";

import "../CSS/AdminPanel.css";
import { url } from "../Url";

const AdminPanel = () => {

  console.log(url);
  return (
    <div className="admin-panel">
      <h1 className="admin-panel-title">Admin Panel</h1>
      <nav className="admin-nav">
        <ul className="admin-nav-list">
          <li className="admin-nav-item">
            <Link to="/addproduct" className="admin-nav-link">
              Add Products
            </Link>
          </li>
          <li className="admin-nav-item">
            <Link to="/orders" className="admin-nav-link">
              Manage Orders
            </Link>
          </li>
          <li className="admin-nav-item">
            <Link to="/updateproduct" className="admin-nav-link">
              Update Product
            </Link>
          </li>
          <li className="admin-nav-item">
            <Link to="/deleteproduct" className="admin-nav-link">
              Delete Product
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminPanel;
