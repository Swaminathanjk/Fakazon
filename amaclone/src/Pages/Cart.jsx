import React, { useEffect, useState, useContext } from "react";
import "./Cart.css";
import CartItems from "../Components/Cart/CartItems";
import CartSummary from "../Components/Cart/CartSummary";
import { CartContext } from "../Context/CartContext"; // Import the custom hook
import axios from "axios";
import { getAuth } from "firebase/auth";

const Cart = () => {
  const [userAddress, setUserAddress] = useState(null);
  const { cartItems, setCartItems, cartTrig } = useContext(CartContext); // Get cartItems from context
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  // Fetch cart and address data when userId or cartTrig changes
  useEffect(() => {
    if (userId) {
      fetchUserAddress(userId); // Fetch user address
      fetchCartData(userId); // Fetch cart data
    }
  }, [userId, cartTrig]); // Trigger re-fetch when cartTrig changes

  // Fetch cart data from backend
  const fetchCartData = async (uid) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.items); // Update cartItems in context
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Fetch user address from backend
  const fetchUserAddress = async (uid) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${uid}`);
      setUserAddress(response.data.address || null);
    } catch (error) {
      console.error("Error fetching user address:", error);
    }
  };

  // Log cartItems to see if they're being fetched correctly
  console.log(cartItems);

  return (
    <div className="cart-container">
      <div className="cart-items-container">
        <h2 className="cart-title">Shopping Cart</h2>

        {/* Check if cartItems is empty */}
        {cartItems.length > 0 ? (
          cartItems.map((cartItem) => (
            <div className="cart-item-wrapper" key={cartItem._id}>
              <CartItems
                item={cartItem.productId}
                quantity={cartItem.quantity}
              />
            </div>
          ))
        ) : (
          <p className="empty-cart-message">No items in the cart</p> // Show if cartItems is empty
        )}
      </div>

      {/* Show Cart Summary only if there are items in the cart */}
      {cartItems.length > 0 && (
        <CartSummary cartItems={cartItems} address={userAddress} />
      )}
    </div>
  );
};

export default Cart;
