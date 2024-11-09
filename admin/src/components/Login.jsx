// src/components/Login.js
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css"
import { url } from "../Url";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin"); // Redirect to admin panel
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="admin-login-container">
  <h2 className="admin-login-title">Admin Login</h2>
  {error && <p className="error-message">{error}</p>}
  <form onSubmit={handleLogin} className="admin-login-form">
    <div className="form-group">
      <label htmlFor="email" className="form-label">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="form-input"
      />
    </div>
    <div className="form-group">
      <label htmlFor="password" className="form-label">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="form-input"
      />
    </div>
    <button type="submit" className="login-button">Login</button>
  </form>
</div>

  );
};

export default Login;
