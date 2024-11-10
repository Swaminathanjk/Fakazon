import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { url } from "../Url";
import '../CSS/ManageOrders.css'

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders. Please try again.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${url}/api/orders/update-status/${id}`, { status });
      fetchOrders(); // Refresh orders after updating
      alert(`Order status updated to ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  // Filter orders based on the search term
  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-orders">
      <h2 className="orders-title">Manage Orders</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by customer name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <ul className="orders-list">
        {filteredOrders.map((order) => (
          <li key={order._id} className="order-item">
            <div className="order-detail">
              <strong>Order ID:</strong> {order._id}
            </div>
            <div className="order-detail">
              <strong>Customer Name:</strong> {order.customerName}
            </div>
            <div className="order-detail">
              <strong>Total Amount:</strong> Rs {order.amount}
            </div>
            <div className="order-detail">
              <strong>Status:</strong>
              <select
                className="order-status-select"
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="order-detail">
              <strong>Products:</strong>
              <ul className="order-products-list">
                {order.items.map((item) => (
                  <li key={item._id} className="product-item">
                    <img 
                      src={`${url}/images/${item.productId.image}`} 
                      alt={item.productId.item_name} 
                      className="product-image" 
                    />
                    <div>
                      <p><strong>Product Name:</strong> {item.productId.item_name}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Price:</strong> Rs {item.productId.current_price}</p>
                      <p><strong>Total Price:</strong> Rs {item.quantity * item.productId.current_price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
      <Link to="/admin">
        <button className="back-button">Back to Manage Products</button>
      </Link>
    </div>
  );
};

export default ManageOrders;
