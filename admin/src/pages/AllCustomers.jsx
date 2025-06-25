import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/AllCustomers.css"; // Ensure you create and style this file

const AllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true); // For showing a loading spinner

  useEffect(() => {
    // Fetch customers data when the component mounts
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/customers"); // Adjust the URL according to your API route
        setCustomers(response.data); // Set fetched data to customers state
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchCustomers();
  }, []); // Empty array ensures the effect runs only once when the component mounts

  return (
    <div className="customers-container">
      <h3 id="page-name">
        Customers <span style={{ fontSize: "1.1em", fontWeight: "bold" }}>&gt;</span> All Customers
      </h3>

      {loading ? (
        <p>Loading...</p> // Show loading text or spinner while waiting for the data
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer._id}>
                <td>{index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.mobileNo}</td>
                <td>{customer.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllCustomers;
