import React, { useState } from "react";
import "./Signup.css"; // Ensure this path is correct
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { auth, db } from "../../firebaseConfig.js"; // Ensure this path is correct
import { createUserWithEmailAndPassword } from "firebase/auth"; // Ensure this path is correct
import axios from "axios"; // Import Axios
import { setDoc, doc } from "firebase/firestore"; // Import Firestore methods
import { useSelector } from "react-redux";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { url } = useSelector((store) => store.url);
  const navigate = useNavigate(); // Use navigate for navigation

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already associated with an account. Please use a different email.";
      case "auth/invalid-email":
        return "The email address is not valid. Please enter a valid email.";
      case "auth/weak-password":
        return "The password is too weak. Please enter at least 6 characters.";
      case "auth/operation-not-allowed":
        return "Account creation is not allowed. Please contact support.";
      default:
        return "An unknown error occurred. Please try again.";
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send the user data to your backend to store in MongoDB
      await axios.post(`${url}/api/user`, {
        uid: user.uid, // Firebase UID
        name: name, // User's name
        email: email, // User's email
      });

      // Optionally, create the user document in Firestore as well
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
      });

      // Navigate to the login page after successful signup
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(getErrorMessage(error.code)); // Use the new function to set a friendly error message
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <Link to="/">
          <img
            src="/images/logo-amazon-login.jpg"
            alt=""
            className="logo-signup"
          />
        </Link>
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)} // Set the name state
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Set the email state
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Set the password state
            />
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Signup;
