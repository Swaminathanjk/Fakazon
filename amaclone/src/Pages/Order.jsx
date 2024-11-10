import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import OrderItems from "../Components/Order/OrderItems";

const Order = () => {
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [username, setUsername] = useState(""); // Local state for username
  console.log(typeof username);

  const [userAddress, setUserAddress] = useState(null); // To store user's current address from backend
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false); // To toggle address form visibility
  const navigate = useNavigate();
  const { url } = useSelector((store) => store.url);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Reference to the user's document in Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const fetchedUsername = userDoc.data().name;
            setUsername(fetchedUsername); // Update local state
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      } else {
        setUsername(""); // Reset to guest if user is not logged in
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      navigate("/home"); // Redirect to login if the user is not logged in
    } else {
      fetchCartData(userId);
      fetchUserAddress(userId);
    }
  }, [userId, navigate,cartItems]);

  // Fetch the user's current address from the backend
  const fetchUserAddress = async (uid) => {
    try {
      const response = await axios.get(`${url}/api/user/${uid}`);
      const { address } = response.data;

      if (address) {
        setUserAddress(address);
        setShippingAddress(address); // If user has an address, set it in the form
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
    }
  };

  const fetchCartData = async (uid) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(`${url}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(response.data.items);
      setTotalAmount(
        response.data.items.reduce(
          (acc, item) => acc + item.productId.current_price * item.quantity,
          0
        )
      );
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zip
    ) {
      alert("Please enter a valid shipping address");
      return;
    }

    setLoading(true);

    const orderData = {
      customerName: username,
      userId,
      address: shippingAddress,
      items: cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.current_price,
      })),
      totalAmount: totalAmount + 99, // Add convenience fee of 99
    };

    try {
      const token = await auth.currentUser.getIdToken();

      // Post the order data to the backend API
      const response = await axios.post(
        `${url}/api/orders/place-order`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.status);
      
      if (response.status === 201) {
        // Clear the cart from the backend after placing the order
        await axios.delete(`${url}/api/cart/clear`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
        setCartItems([]);
      setLoading(false);
      alert("Order placed successfully!");
    }
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressSave = async () => {
    try {
      const response = await axios.post(`${url}/api/user/updateAddress`, {
        uid: userId,
        address: shippingAddress,
      });
      alert("Address updated successfully");
      setUserAddress(shippingAddress); // Save updated address
      setShowAddressForm(false); // Close address form after saving
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Error updating address. Please try again.");
    }
  };
  console.log(cartItems);

  return (
    <div>
      <h3>Order Summary</h3>
      <div>
        <h4>Username: {username}</h4> {/* Display the username */}
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div className="order-item-wrapper" key={item._id}>
              <OrderItems
                item={item.productId} // Assuming `productId` contains product details
                quantity={item.quantity} // Quantity of each item in the order
              />
            </div>
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      <div>
        {userAddress ? (
          <>
            <h4>Shipping Address</h4>
            <p>{`${userAddress.street}, ${userAddress.city}, ${userAddress.state}, ${userAddress.zip}`}</p>
            <button onClick={() => setShowAddressForm(true)}>
              Change Address
            </button>
          </>
        ) : (
          <div>
            <h4>No Address Found</h4>
            <button onClick={() => setShowAddressForm(true)}>
              Add Address
            </button>
          </div>
        )}
      </div>

      {showAddressForm && (
        <div>
          <h4>{userAddress ? "Update Address" : "Add Address"}</h4>
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={shippingAddress.street}
            onChange={handleAddressChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingAddress.city}
            onChange={handleAddressChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={shippingAddress.state}
            onChange={handleAddressChange}
          />
          <input
            type="text"
            name="zip"
            placeholder="Zip Code"
            value={shippingAddress.zip}
            onChange={handleAddressChange}
          />
          <button onClick={handleAddressSave}>Save Address</button>
        </div>
      )}

      <div>
        <div>
          <strong>
            Total (including $99 convenience fee): ${totalAmount + 99}
          </strong>
        </div>
        <button onClick={handlePlaceOrder} disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Order;
