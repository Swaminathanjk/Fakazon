// Login.js

import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebaseConfig.js"; // Ensure this path is correct
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { usernameActions } from "../../Store/usernameSlice.js";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No user found with this email. Please check your email or sign up.";
      case "auth/wrong-password":
        return "The password entered is incorrect. Please try again.";
      case "auth/invalid-email":
        return "The email address is not valid. Please enter a valid email.";
      case "auth/user-disabled":
        return "This user account has been disabled. Please contact support.";
      default:
        return "An unknown error occurred. Please try again.";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch the user's name from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        dispatch(usernameActions.setUsername(userData.name)); // Set username
      }

      // Get the user's Firebase token
      const token = await user.getIdToken();
      dispatch(usernameActions.setToken(token)); // Store token in Redux
      console.log("Firebase Token:", token); // Log the token

      navigate("/home");
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <Link to="/home">
          <img
            src="/images/logo-amazon-login.jpg"
            alt=""
            className="logo-login"
          />
        </Link>
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
