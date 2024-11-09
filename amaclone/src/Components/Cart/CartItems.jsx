import React, { useState, useEffect, useContext } from "react";
import "./CartItems.css";
import { FaTrash } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FiMinusCircle } from "react-icons/fi";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { CartContext } from "../../Context/CartContext";

const CartItems = ({ item, quantity }) => {
  const [localItemCount, setLocalItemCount] = useState(quantity); // Initialize with the current quantity
  const { setCartItems, setCartCount } = useContext(CartContext);
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  // Fetch cart data when the component mounts or when the user ID changes
  useEffect(() => {
    if (userId) {
      fetchCartData(userId);
    }
  }, [userId]);

  const fetchCartData = async (uid) => {
    if (!uid) {
      console.log("User is not logged in.");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartCount(response.data.items.length); // Update cart count based on fetched items
      setCartItems(response.data.items);
      updateItemCount(response.data.items);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Update local item count based on cart data
  const updateItemCount = (cartItems) => {
    const itemInCart = cartItems.find(
      (cartItem) => cartItem.productId._id === item._id
    );
    setLocalItemCount(itemInCart ? itemInCart.quantity : 0);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Please login to add items to the cart.");
      return;
    }

    let updatedItemCount = localItemCount === 0 ? 1 : localItemCount + 1;

    setLocalItemCount(updatedItemCount); // Update immediately in UI

    const cartItemData = {
      userId,
      productId: item._id,
      quantity: updatedItemCount,
    };

    try {
      const token = await auth.currentUser.getIdToken();

      if (localItemCount === 0) {
        await axios.post(
          "http://localhost:5000/api/cart/add",
          { userId, items: [{ productId: item._id, quantity: updatedItemCount }] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Item added to backend cart");
      } else {
        await axios.patch(
          "http://localhost:5000/api/cart/update",
          cartItemData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Item quantity updated in backend cart");
      }

      fetchCartData(userId); // Re-fetch the latest cart data
    } catch (error) {
      console.error("Error adding or updating item in cart:", error);
      setLocalItemCount(localItemCount); // Revert local count if there's an error
    }
  };

  const handleRemoveFromCart = async () => {
    if (!userId) {
      alert("Please login to remove items from the cart.");
      return;
    }

    if (localItemCount <= 0) {
      console.log("Item is not in the cart.");
      return;
    }

    const updatedItemCount = localItemCount - 1;

    try {
      const token = await auth.currentUser.getIdToken();

      if (updatedItemCount === 0) {
        // Remove the item from the cart if count reaches 0
        await axios.delete(
          `http://localhost:5000/api/cart/remove/${item._id}`,
          {
            data: { userId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Item removed from backend cart");
      } else {
        const cartItemData = {
          userId,
          productId: item._id,
          quantity: updatedItemCount,
        };
        await axios.patch(
          "http://localhost:5000/api/cart/update",
          cartItemData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Item quantity updated in backend cart");
      }

      setLocalItemCount(updatedItemCount); // Update local count in UI
      fetchCartData(userId); // Re-fetch cart after changes
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setLocalItemCount(localItemCount); // Revert to previous count on error
    }
  };

  // Only render the product if its quantity is greater than 0
  if (localItemCount <= 0) {
    return null; // Do not render the item when its quantity is 0
  }

  const handleRemoveFullItem = async () => {
    if (!userId) {
      alert("Please login to remove items from the cart.");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`http://localhost:5000/api/cart/remove/${item._id}`, {
        data: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Item removed from backend cart");
      fetchCartData(userId); // Re-fetch cart after changes
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
    }

  return (
    <div className="cart-item-container">
      <div className="item-left-part">
        <img
          className="cart-item-img"
          src={`http://localhost:5000/images/${item.image}`}
          alt={item.item_name}
        />
      </div>
      <div className="item-right-part">
        <div className="company">{item.company}</div>
        <div className="item-name">{item.item_name}</div>
        <div className="price-container">
          <span className="current-price">Rs {item.current_price}</span>
          <span className="original-price">Rs {item.original_price}</span>
          <span className="discount-percentage">({item.discount_percentage}% OFF)</span>
        </div>
        <div className="qty">
          Qty: {localItemCount}{" "}
          <IoMdAddCircleOutline onClick={handleAddToCart} className="add" />
          <FiMinusCircle onClick={handleRemoveFromCart} className="minus" />
        </div>
      </div>
      <div className="remove-from-cart" onClick={handleRemoveFullItem}>
        <FaTrash />
      </div>
    </div>
  );
};

export default CartItems;
