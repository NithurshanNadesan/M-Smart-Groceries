import React from "react";
import Swal from "sweetalert2";
import "../css/Logout.css"; // Add your custom CSS for styling
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Logout = () => {

  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    // SweetAlert confirmation
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to logout from M Smart Groceries?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove the token from localStorage to log the user out
        localStorage.removeItem("token");

        // Optionally, show a success message after logging out
        Swal.fire("Logged out!", "You have been logged out successfully.", "success").then(() => {
          // Redirect the user to the login page
          navigate("/login");
        });
      }
    });
  };

  return (
    <div className="logout-container">
      <h2>Logout</h2>
      <p>Are you sure you want to logout from M Smart Groceries?</p>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
