import React, { useEffect, useState, useContext } from "react";
import "./HomeItems.css";
import { FaTrash } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import { CartContext } from "../../Context/CartContext.jsx";

const HomeItems = ({ item }) => {
  const [localItemCount, setLocalItemCount] = useState(0); // State to store item count locally
  const { url } = useSelector((store) => store.url);
  const auth = getAuth();
  const user = auth.currentUser; // Get the currently logged-in user
  const userId = user ? user.uid : null; // Use Firebase UID as the user identifier
  const { setCartCount } = useContext(CartContext);

  // Fetch the cart data when the component mounts or when the user ID changes
  useEffect(() => {
    if (userId) {
      fetchCartData(userId); // Fetch cart data when component mounts
    }
  }, [userId]);

  // Fetch the cart data from the backend
  const fetchCartData = async (uid) => {
    if (!uid) {
      console.log("User is not logged in.");
      return; // Early exit if userId is not available
    }

    try {
      // Get the Firebase token for the authenticated user
      const token = await auth.currentUser.getIdToken();
      // console.log(token);

      console.log(`Fetching cart for userId: ${uid}`);
      const response = await axios.get(`${url}/api/cart`, {
        headers: {
          Authorization: ` Bearer ${token}`, // Pass the Firebase token in the Authorization header
        },
      });
      setCartCount(response.data.items.length); // Set cart count based on fetched items

      updateItemCount(response.data.items);

      // Dispatch each product ID to Redux, then set the total count

      // Set total cart count in Redux
    } catch (error) {
      console.error("Error fetching cart data:", error);
      if (error.response) {
        console.error("Backend error:", error.response.data);
      }
    }
  };

  // Update the local item count based on cart data
  const updateItemCount = (cartItems) => {
    // Find the item in the cart based on the productId._id
    const itemInCart = cartItems.find(
      (cartItem) => cartItem.productId._id === item._id
    );

    // If item is in the cart, set the count to its quantity; otherwise, set count to 0
    setLocalItemCount(itemInCart ? itemInCart.quantity : 0);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Please login to add items to the cart.");
      return;
    }
    let updatedItemCount;

    // If the item is not already in the cart (localItemCount is 0), add the item
    if (localItemCount === 0) {
      updatedItemCount = 1; // Set count to 1 for a new item
    } else {
      updatedItemCount = localItemCount + 1; // Otherwise, increment the quantity
    }

    // Update the localItemCount immediately to reflect the change in UI
    setLocalItemCount(updatedItemCount);

    const cartItemData = {
      userId,
      productId: item._id, // Product ID
      quantity: updatedItemCount, // Updated quantity
    };

    try {
      const token = await auth.currentUser.getIdToken();

      if (localItemCount === 0) {
        // If localItemCount is 0, add the item to the cart
        const response = await axios.post(
          `${url}/api/cart/add`,
          {
            userId,
            items: [{ productId: item._id, quantity: updatedItemCount }],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Item added to backend cart");
      } else {
        // If localItemCount is greater than 0, update the item quantity in the cart
        const response = await axios.patch(
          `${url}/api/cart/update`,
          cartItemData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Item quantity updated in backend cart");
      }

      // Fetch the latest cart data to ensure local state is in sync
      fetchCartData(userId);
    } catch (error) {
      console.error("Error adding or updating item in cart:", error);

      // Revert to previous count if there's an error
      setLocalItemCount(localItemCount);
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
        // Remove item completely from the cart
        await axios.delete(`${url}/api/cart/remove/${item._id}`, {
          data: { userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Update the item quantity if still greater than 0
        const cartItemData = {
          userId,
          productId: item._id,
          quantity: updatedItemCount,
        };
        await axios.patch(`${url}/api/cart/update`, cartItemData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      console.log("Item updated in backend cart");
      fetchCartData(userId); // Re-fetch the cart to reflect changes
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setLocalItemCount(localItemCount); // Revert the local count if the request fails
    }
  };

  return (
    <div className="item-container">
      <img
        className="item-image"
        src={`${url}/images/${item.image}`}
        alt={item.item_name}
      />
      <div className="item-details">
        <div className="company-name">{item.company}</div>
        <div className="item-name">{item.item_name}</div>
        <div className="price">
          <span className="current-price">Rs {item.current_price}</span>
          <span className="original-price">Rs {item.original_price}</span>
          <span className="discount">({item.discount_percentage}% OFF)</span>
        </div>
        {localItemCount > 0 ? (
          <div>
            <button className="btn-add-bag" onClick={handleAddToCart}>
              <IoMdAddCircleOutline className="add" />
              Add to Bag {localItemCount}
            </button>
            <button className="btn-remove-bag" onClick={handleRemoveFromCart}>
              <FaTrash className="trash" />
              Remove from Bag
            </button>
          </div>
        ) : (
          <button className="btn-add-bag" onClick={handleAddToCart}>
            Add to Bag
          </button>
        )}
      </div>
    </div>
  );
};

// export const itemcount = localItemCount;

export default HomeItems;
