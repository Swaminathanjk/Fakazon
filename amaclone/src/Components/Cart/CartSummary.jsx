import React, { useContext, useState } from "react";
import axios from "axios";
import { CartContext } from "../../Context/CartContext";
import "./CartSummary.css";

const CartSummary = ({ userId, address }) => {
  const { cartItems } = useContext(CartContext); // Accessing cartItems from context
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // "stripe" or "cod"

  console.log("CartItems:", cartItems);
  
  // Calculate pricing details dynamically
  let totalItem = cartItems.length; // Number of unique items in the cart
  let totalMRP = 0;
  let totalDiscount = 0;
  const CONVENIENCE_FEES = 99;
  let finalPayment = 0;

  // Calculating total MRP, discount, and final payment
  cartItems.forEach((cartItem) => {
    const quantity = cartItem.quantity;
    const product = cartItem.productId;
    if (quantity > 0) {
      totalMRP += product.original_price * quantity;
      totalDiscount +=
        (product.original_price - product.current_price) * quantity;
      finalPayment += product.current_price * quantity;
    }
  });

  // Function to handle placing an order
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId,
        items: cartItems.map((cartItem) => ({
          _id: cartItem.productId._id,
          quantity: cartItem.quantity,
          name: cartItem.productId.item_name,
          price: cartItem.productId.current_price,
        })),
        amount: finalPayment + CONVENIENCE_FEES,
        address,
      };

      if (paymentMethod === "stripe") {
        const response = await axios.post("/api/orders/placeOrder", orderData);
        if (response.data.success) {
          window.location.href = response.data.session_url; // Redirect to stripe session
        } else {
          console.log("Failed to place order:", response.data.message);
        }
      } else {
        const response = await axios.post(
          "/api/orders/placeOrderCod",
          orderData
        );
        if (response.data.success) {
          alert("Order successfully placed with Cash on Delivery!");
        } else {
          console.log("Failed to place order:", response.data.message);
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="cart-summary">
      <div className="cart-details-container">
        <div className="price-header">PRICE DETAILS ({totalItem} Items) </div>

        <div className="price-item">
          <span className="price-item-tag">Total MRP</span>
          <span className="price-item-value">₹{totalMRP}</span>
        </div>

        <div className="price-item">
          <span className="price-item-tag">Discount on MRP</span>
          <span className="price-item-value priceDetail-base-discount">
            -₹{totalDiscount}
          </span>
        </div>

        <div className="price-item">
          <span className="price-item-tag">Convenience Fee</span>
          <span className="price-item-value">₹{CONVENIENCE_FEES}</span>
        </div>

        <div className="price-footer">
          <span className="price-item-tag">Total Amount</span>
          <span className="price-item-value">
            ₹{finalPayment + CONVENIENCE_FEES}
          </span>
        </div>
      </div>

      <div className="payment-method-container">
        <label>
          <input
            type="radio"
            value="stripe"
            checked={paymentMethod === "stripe"}
            onChange={() => setPaymentMethod("stripe")}
          />
          Online(Stripe)
        </label>
        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          Cash On Delivery
        </label>
      </div>

      <button
        className="btn-place-order"
        onClick={handlePlaceOrder} // Call handlePlaceOrder on click
      >
        <h3>Place Order</h3>
      </button>
    </div>
  );
};

export default CartSummary;
