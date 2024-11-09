import React, { useEffect, useState, useContext } from "react";
import "./Header.css";
import { IoLocationOutline } from "react-icons/io5";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { usernameActions } from "../../Store/usernameSlice.js";
import { signOut, getAuth } from "firebase/auth"; // Import signOut from Firebase Auth
import { CartContext } from "../../Context/CartContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../Store/categorySlice.js";
const Header = () => {
  const auth = getAuth();
  const [username, setUsername] = useState(""); // Local state for username
  const { cartCount, setCartCount, setCartItems } = useContext(CartContext);
  const dispatch = useDispatch();
  const categories = [
    "All",
    "Electronics",
    "Groceries",
    "Clothing",
    "Furniture",
    "Jewelry",
    "Toys",
  ]; // Example categories

  const selectedCategory = useSelector(
    (state) => state.category.selectedCategory
  );

  // console.log("cartcount", cartCount);

  // Fetch the cart data from the backend

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
  }, [dispatch]);

  // Function to handle sign out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        setUsername(""); // Reset username state
        setCartCount(0);
        setCartItems([]);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleCategoryChange = (event) => {
    dispatch(setCategory(event.target.value)); // Update selected category in Redux
  };

  return (
    <div className="header">
      <Link to="/home">
        <img src="/images/logo-amazon.jpg" alt="Logo" className="logo" />
      </Link>
      <div className="userLocation">
        <div className="deliveryTo">Delivering to Chennai 60001</div>
        <div className="deliveryToLocation">
          <IoLocationOutline className="locationIcon" />
          Update location
        </div>
      </div>
      <div className="category">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-dropdown"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="searchbar">
        <input className="searchInput" placeholder="Search"></input>
        <FaSearch className="searchIcon" />
      </div>
      <div className="header_nav">
        {username ? (
          // If the user is logged in, show "Sign Out"
          <div
            className="header_option login_option"
            style={{ cursor: "pointer", textDecoration: "none" }}
            onClick={handleSignOut}
          >
            <span className="header_optionLineOne">{`Hello, ${username}`}</span>

            <span className="header_optionLineTwo">Sign Out</span>
          </div>
        ) : (
          // If the user is not logged in, show "Sign In"
          <Link
            to="/"
            className="header_option login_option"
            style={{ textDecoration: "none" }}
          >
            <span className="header_optionLineOne">Hello, Guest</span>

            <span className="header_optionLineTwo">Sign In</span>
          </Link>
        )}
        <div className="header_option">
          <span className="header_optionLineOne">Returns</span>
          <span className="header_optionLineTwo">& orders</span>
        </div>
        <div className="header_option">
          <span className="header_optionLineOne">Your</span>
          <span className="header_optionLineTwo">Prime</span>
        </div>
        <div className="header_optionBasket">
          <Link to="/cart">
            <FaShoppingCart className="header_cart" />
          </Link>
          <span className="header_optionLineTwo header_basketCount">
            {cartCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
