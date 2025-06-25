import React, { useState, useEffect } from "react";
import "../css/Sales.css"; 
import axios from "axios";
import { Link } from "react-router-dom";

const Sales = () => {
  const [salesDetails, setSalesDetails] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const [detailsRes, categoryRes] = await Promise.all([
        axios.get("http://localhost:4000/sales/sales-details"),
        axios.get("http://localhost:4000/sales/sales-by-category")
      ]);

      setSalesDetails(detailsRes.data);
      setSalesByCategory(categoryRes.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString();
  };

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h3 id="page-name">Sales Form</h3>
        <Link to="/sales-prediction">
          <button className="predict-btn">Predict Sales</button>
        </Link>
      </div>

      {/* Sales Details Table */}
      <h4>Sales Details</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Sales Amount</th>
          </tr>
        </thead>
        <tbody>
          {salesDetails.map((sale, index) => (
            <tr key={sale.orderId}>
              <td>{index + 1}</td>
              <td>{sale.orderId}</td>
              <td>{sale.customer}</td>
              <td>{formatDate(sale.date)}</td>
              <td>Rs. {sale.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sales by Category Table */}
      <h4>Sales by Category</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Category</th>
            <th>Sales Amount</th>
          </tr>
        </thead>
        <tbody>
          {salesByCategory.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td>{category.category}</td>
              <td>Rs. {category.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
