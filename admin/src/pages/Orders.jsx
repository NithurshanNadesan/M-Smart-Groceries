import React, { useEffect, useState } from "react";
import "../css/Orders.css";
import axios from "axios";
import Swal from 'sweetalert2';
import { FiClock, FiCheckCircle } from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orderItemsMap, setOrderItemsMap] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:4000/orders");
      setOrders(res.data);

      // Fetch order items for each order
      const itemsMap = {};
      await Promise.all(
        res.data.map(async (order) => {
          const itemsRes = await axios.get(`http://localhost:4000/order-details/${order._id}`);
          itemsMap[order._id] = itemsRes.data;
        })
      );
      setOrderItemsMap(itemsMap);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleMarkAsComplete = async (orderId) => {
    try {
        // SweetAlert confirmation dialog
        const result = await Swal.fire({
            title: 'Confirm Order Completion',
            html: `Are you sure you want to mark this order as complete?<br/><br/>This will Update order status to "Shipped",<br/>Reduce product stock quantities,<br/>Send shipping notification to customer.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, mark as shipped!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) {
            return;
        }

        // First update the order status (this will trigger the email)
        await axios.put(`http://localhost:4000/orders/${orderId}`, { 
            status: "Shipped" 
        });

        // Then update the stock quantities for each item in the order
        const orderItems = orderItemsMap[orderId] || [];
        await Promise.all(
            orderItems.map(async (item) => {
                await axios.put(
                    `http://localhost:4000/product-variants/update-stock/${item.productVariantFk._id}`,
                    { quantity: -item.quantity }
                );
            })
        );
        
        // SweetAlert success message
        await Swal.fire({
            title: 'Success!',
            html: `
                <p>Order marked as shipped successfully!</p>
                <p>The customer has been notified via email.</p>
            `,
            icon: 'success',
            confirmButtonText: 'OK'
        });
        
        fetchOrders(); // Refresh list
    } catch (error) {
        console.error("Error updating order status or stock:", error);
        
        // SweetAlert error message
        await Swal.fire({
            title: 'Error!',
            html: `
                <p>Failed to complete order:</p>
                <p><strong>${error.response?.data?.message || error.message}</strong></p>
                <p>Please try again or contact support.</p>
            `,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
};



  const renderProductList = (items) => {
    return items.map((item, index) => {
      const product = item.productVariantFk;
      return (
        <div key={index} className="text-sm">
          {product?.productFk?.name || "Product"} {product?.size} (x{item.quantity}) - Rs.{" "}
          {product?.newPrice * item.quantity}
        </div>
      );
    });
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString();
  };

  const renderOrderCard = (order) => {
    const items = orderItemsMap[order._id] || [];

    return (
      <div key={order._id} className="order-card">
        <div className="order-id">Order ID: <span>{order._id}</span></div>
        <div className="order-customer">Customer: {order.customerFk?.name || "Unknown"}</div>
        <div className="order-date">Date: {formatDate(order.orderDate)}</div>
        <div className="order-status">
          Status:{" "}
          <span className={order.status === "Shipped" ? "shipped" : "pending"}>
            {order.status || "Pending"}
          </span>
        </div>

        <div className="order-products">
          <div className="product-title">Products:</div>
          <div className="product-list">{renderProductList(items)}</div>
        </div>

        <div className="order-totals">
          <div>Total: Rs. {order.total}</div>
          <div>Discount: {order.discountFk?.name || "No Discount"} ({order.discountFk?.percentage || 0}%)</div>
          <div>Delivery Fee: Rs. {order.deliveryFee || 0}</div>
          <div className="net-amount">Net Amount: Rs. {order.netAmount}</div>
        </div>

        {order.status !== "Shipped" && (
          <button className="mark-complete-btn" onClick={() => handleMarkAsComplete(order._id)}>
            Mark As Complete
          </button>
        )}
      </div>
    );
  };

  const pendingOrders = orders.filter((o) => o.status !== "Shipped");
  const shippedOrders = orders.filter((o) => o.status === "Shipped");

  return (
    <div className="orders-wrapper">
      <div className="orders-pending">
        <h2 className="orders-heading">
          <FiClock size={25} />
          Pending Orders <span className="order-count">({pendingOrders.length})</span>
        </h2>

        {pendingOrders.length > 0 ? (
          pendingOrders.map((order) => renderOrderCard(order))
        ) : (
          <div className="no-orders">No pending orders.</div>
        )}
      </div>
      <div className="orders-shipped">
      <h2 className="orders-heading">
        <FiCheckCircle size={24} />
        Shipped Orders <span className="order-count">({shippedOrders.length})</span>
      </h2>
        {shippedOrders.length > 0 ? (
          shippedOrders.map((order) => renderOrderCard(order))
        ) : (
          <div className="no-orders">No shipped orders yet.</div>
        )}
      </div>
    </div>
  );  
};

export default Orders;
