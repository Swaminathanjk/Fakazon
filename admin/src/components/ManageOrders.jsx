import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { url } from "../Url";
const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders. Please try again.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/orders/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchOrders(); // Refresh orders after updating
      alert(`Order status updated to ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  return (
    <div>
      <h2>Manage Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order ID: {order._id} - Status: {order.status}
            <button onClick={() => updateStatus(order._id, "Shipped")}>
              Mark as Shipped
            </button>
            <button onClick={() => updateStatus(order._id, "Delivered")}>
              Mark as Delivered
            </button>
            <button onClick={() => updateStatus(order._id, "Canceled")}>
              Cancel Order
            </button>
          </li>
        ))}
      </ul>
      <Link to="/admin"><button>Back to Manage Products</button></Link>
    </div>
  );
};

export default ManageOrders;
