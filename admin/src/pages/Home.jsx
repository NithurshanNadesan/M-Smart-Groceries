import { useState, useEffect } from "react";
import "../css/Home.css";
import { FiBox, FiTag, FiUsers } from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = () => {
  // State for product, category, and customer counts
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    customers: 0,
  });

  // State for stock data
  const [stockData, setStockData] = useState({
    labels: [],
    datasets: [
      {
        label: "Inventory Level",
        data: [],
        backgroundColor: [],
        borderRadius: 5,
      },
    ],
  });

  // Fetch counts for products, categories, and customers
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [productRes, categoryRes, customerRes] = await Promise.all([
          fetch("http://localhost:4000/products/count"),
          fetch("http://localhost:4000/categories/count"),
          fetch("http://localhost:4000/customers/count"),
        ]);

        const productData = await productRes.json();
        const categoryData = await categoryRes.json();
        const customerData = await customerRes.json();

        setCounts({
          products: productData.count || 0,
          categories: categoryData.count || 0,
          customers: customerData.count || 0,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  // Fetch stock data for the bar chart
  useEffect(() => {
    const colors = ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#ffa726", "#66bb6a", "#42a5f5", "#ab47bc"];
    
    fetch("http://localhost:4000/get/stock-by-category")
      .then((res) => res.json())
      .then((data) => {
        const categories = data.map((item) => item._id); // Category names
        const stockCounts = data.map((item) => item.totalStock); // Stock numbers

        setStockData({
          labels: categories,
          datasets: [
            {
              label: "Stocks",
              data: stockCounts,
              backgroundColor: colors.slice(0, data.length),
              borderRadius: 5,
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching stock data:", error));
  }, []);

  return (
    <div className="home-container">
      <h3 id="page-name">Admin Dashboard</h3>

      {/* Cards */}
      <div className="cards-container">
        <div className="card">
          <h3>Products</h3>
          <FiBox className="card-icon-p" />
          <p className="count-badge product-count" >{counts.products}</p>
        </div>
        <div className="card">
          <h3>Categories</h3>
          <FiTag className="card-icon-c" />
          <p className="count-badge category-count">{counts.categories}</p>
        </div>
        <div className="card">
          <h3>Customers</h3>
          <FiUsers className="card-icon-u" />
          <p className="count-badge user-count">{counts.customers}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="chart-container">
        <h3>Inventory Levels by Categories</h3>
        <Bar data={stockData} />
      </div>
    </div>
  );
};

export default Home;
