import React, { useContext, useState } from "react";
import axios from "axios";
import { CartContext } from "../../Context/CartContext";
import "./CartSummary.css";
import {Link, useNavigate} from "react-router-dom"
const CartSummary = ({ userId, address }) => {
  const { cartItems } = useContext(CartContext); // Accessing cartItems from context
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // "stripe" or "cod"
  const navigate = useNavigate();
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
    navigate("/payment")
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
        <Link><h3>Proceed to Checkout</h3></Link>
      </button>
    </div>
  );
};

export default CartSummary;
