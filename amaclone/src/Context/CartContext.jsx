import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [localItemCount, setLocalItemCount] = useState(0); // State to store item count locally
  const [cart, setCart] = useState([]); // Cart state to store items in the cart

  const [cartItems, setCartItems] = useState([]); // Shared cart items state
  const [cartTrig, setCartTrig] = useState(false); // A trigger for updates

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    if (userId) {
      fetchCartData(userId);
    }
  }, [cartTrig, userId]);

  // Fetch cart data
  const fetchCartData = async (uid) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.items); // Set fetched cart items
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        cartItems,
        setCartItems,
        cartTrig,
        setCartTrig,
        cartCount,
        setCartCount,
        localItemCount,
        setLocalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
