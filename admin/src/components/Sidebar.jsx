import { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // Ensure the CSS is linked properly
import { FiTag, FiBox, FiLayers, FiShoppingCart, FiUsers, FiSpeaker, FiTruck, FiClipboard, FiDollarSign, FiBarChart, FiLogOut } from "react-icons/fi";

const Sidebar = () => {

  const [expandedCustomers, setExpandedCustomers] = useState(false);

  return (
    <aside id="sidebar">
      <div className="d-flex justify-content-between p-4">
        <div className="sidebar-logo">
          <Link to="/">M Smart Groceries</Link>
        </div>
      </div>
      <ul className="sidebar-nav">
        <li className="sidebar-item">
          <Link to="/brands-categories" className="sidebar-link">
            <FiTag />
            <span>Brands & Categories</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/product" className="sidebar-link" >
            <FiBox />
            <span>Products</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/product-variant" className="sidebar-link">
            <FiLayers />
            <span>Product Variants</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/orders" className="sidebar-link">
            <FiShoppingCart />
            <span>Orders</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="#" className="sidebar-link" onClick={() => setExpandedCustomers(!expandedCustomers)}>
            <FiUsers />
            <span>Customers</span>
          </Link>
          {expandedCustomers && (
            <ul className="nested-items">
              <li><Link to="/all-customers">-  All Customers</Link></li>
              <li><Link to="/chatbot-logs">-  Chatbot Logs</Link></li>
            </ul>
          )}
        </li>
        <li className="sidebar-item">
          <Link to="/ad" className="sidebar-link">
            <FiSpeaker />
            <span>Advertisements</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/supplier-details" className="sidebar-link">
            <FiTruck />
            <span>Supplier Details</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/stock-purchase" className="sidebar-link">
            <FiClipboard />
            <span>Stock Purchase</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/sales" className="sidebar-link">
            <FiDollarSign />
            <span>Sales</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/reports" className="sidebar-link">
            <FiBarChart />
            <span>Reports</span>
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <Link to="/logout" className="sidebar-link">
          <FiLogOut />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;