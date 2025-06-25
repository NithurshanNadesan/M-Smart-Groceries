import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/admins/login", { username, password });
  
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("adminId", response.data.adminId); // 🟢 Save here
        localStorage.setItem("adminName", response.data.name); // 🟢 Save here
  
        Swal.fire({
          title: "Login Successful!",
          text: "You are now logged in.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/"); // Redirect to dashboard
        });
      }
    } catch (error) {
      // Handle incorrect credentials (400 error)
      Swal.fire({
        title: "Login Failed!",
        text: error.response?.data?.message || "Incorrect credentials. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="admin-login-title">M Smart Groceries Admin Login</h2>
        <p className="admin-login-subtext">
          Please fill in your unique admin login details below
        </p>
        <form onSubmit={handleLogin}>
          <label className="admin-login-label">Username</label>
          <input
            type="text"
            className="admin-login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label className="admin-login-label">Password</label>
          <input
            type="password"
            className="admin-login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="admin-login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
