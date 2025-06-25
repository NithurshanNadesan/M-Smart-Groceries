import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar"
import TopBar from "./components/TopBar";
import Home from "./pages/Home";
import BrandsCategories from "./pages/BrandsCategories";
import Product from "./pages/Product";
import ProductVariant from "./pages/ProductVariant";
import AllCustomers from "./pages/AllCustomers";
import ChatbotLogs from "./pages/ChatbotLogs";
import Advertisement from "./pages/Advertisement";
import SupplierDetails from "./pages/SupplierDetails";
import StockPurchase from "./pages/StockPurchase";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import SalesPrediction from "./pages/SalesPrediction";
import Logout from "./pages/Logout";
import Login from "./pages/Login"; // Import your Login component
import Orders from "./pages/Orders";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Separate Login Page with its own main container */}
        <Route
          path="/login"
          element={
            <main className="login-main">
              <Login />
            </main>
          }
        />

        {/* Authenticated Routes with Sidebar & Topbar */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div className="wrapper">
                <Sidebar />
                <div className="main">
                  <TopBar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/brands-categories" element={<BrandsCategories />} />
                    <Route path="/product" element={<Product />} />
                    <Route path="/product-variant" element={<ProductVariant />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/all-customers" element={<AllCustomers />} />
                    <Route path="/chatbot-logs" element={<ChatbotLogs />} />
                    <Route path="/ad" element={<Advertisement />} />
                    <Route path="/supplier-details" element={<SupplierDetails />} />
                    <Route path="/stock-purchase" element={<StockPurchase />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/sales-prediction" element={<SalesPrediction />} />
                    <Route path="/logout" element={<Logout handleLogout={handleLogout} />} />
                  </Routes>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
