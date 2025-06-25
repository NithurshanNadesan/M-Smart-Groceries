import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import './CSS/Orders.css';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/orders/customer/${user._id}`
      );
      setOrders(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to load orders',
        text: error.response?.data?.message || 'Please try again later',
        confirmButtonColor: '#673B11'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/order-details/${orderId}`
      );
      return response.data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to load order details',
        text: error.response?.data?.message || 'Please try again later',
        confirmButtonColor: '#673B11'
      });
      return [];
    }
  };

  const toggleOrderDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      const details = await fetchOrderDetails(orderId);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, items: details } : order
        )
      );
      setExpandedOrder(orderId);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shipped':
        return '#28a745';
      case 'Pending':
        return '#ea580c';
      default:
        return '#6c757d';
    }
  };

  if (!user) {
    return (
      <div className="orders-background">
        <div className="orders-container">
          <h2>Please login to view your orders</h2>
          <button onClick={() => navigate('/loginSignup')} className="login-redirect-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-background">
      <div className="orders-container">
        <div className="orders-header">
          <h2>My Orders</h2>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/')} className="shop-now-btn">
              Shop Now
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div 
                  className="order-summary" 
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  <div className="order-info">
                    <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span className="order-date">{formatDate(order.orderDate)}</span>
                    <span
                      className="order-status" 
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="order-total">
                    <span>Total: Rs.{order.netAmount.toFixed(2)}</span>
                    {order.discountFk && (
                      <span className="order-discount">(Saved Rs.{(order.total - order.netAmount).toFixed(2)})</span>
                    )}
                  </div>
                  <div className="order-toggle">
                    {expandedOrder === order._id ? '▲' : '▼'}
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="order-details">
                    <div className="order-items">
                      <h4>Items</h4>
                      {order.items?.map(item => (
                        <div key={item._id} className="order-item">
                          <div className="item-info">
                            <span className="item-name">
                              {item.productVariantFk?.productFk?.name || 'Product'} - {item.productVariantFk?.size || 'Size'}
                            </span>
                            <span className="item-quantity">Qty: {item.quantity}</span>
                          </div>
                          <div className="item-price">
                            Rs.{(item.price || 0).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-payment">
                      <h4>Payment Information</h4>
                      <p>Method: {order.paymentMethod}</p>
                      <div className="order-totals">
                        <div className="total-row">
                          <span>Subtotal:</span>
                          <span>Rs.{order.total.toFixed(2)}</span>
                        </div>
                        {order.discountFk && (
                          <div className="total-row discount">
                            <span>Discount:</span>
                            <span>-Rs.{(order.total - order.netAmount).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="total-row grand-total">
                          <span>Total:</span>
                          <span>Rs.{order.netAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;