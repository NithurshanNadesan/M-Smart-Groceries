import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/ChatbotLogs.css"; // Ensure you create and style this file

const ChatbotLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true); // For showing loading state

  useEffect(() => {
    // Fetch chatbot logs when the component mounts
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/chatbot-logs/"); // Adjust the URL based on your backend API route
        setLogs(response.data.chatbotLogs); // Set the fetched logs to the state
      } catch (error) {
        console.error("Error fetching chatbot logs:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchLogs();
  }, []); // Empty array to run only once when component mounts

  return (
    <div className="chatbot-logs-container">
      <h3 id="page-name">
        Customers <span style={{ fontSize: "1.1em", fontWeight: "bold" }}>&gt;</span> Chatbot Logs
      </h3>

      {loading ? (
        <p>Loading...</p> // Show loading text or spinner while waiting for data
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Customer</th>
              <th>Query</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={log._id}>
                <td>{index + 1}</td>
                <td>{log.customerFk.name}</td>
                <td>{log.query}</td>
                <td>{new Date(log.timeStamp).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td> {/* Format timestamp if needed */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ChatbotLogs;
