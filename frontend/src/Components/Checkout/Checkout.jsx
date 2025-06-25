import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import { ShopContext } from '../../Context/ShopContext';
import { AuthContext } from '../../Context/AuthContext'; // Import AuthContext
import Swal from 'sweetalert2';
import axios from 'axios';

const Checkout = () => {
  const {
    getTotalCartAmount,
    allProducts,
    cartItems,
    clearCart
  } = useContext(ShopContext);

  const { user } = useContext(AuthContext); // Get user from AuthContext
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [discounts, setDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch discounts from backend
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/discounts');
        const sortedDiscounts = response.data.sort((a, b) => b.percentage - a.percentage);
        setDiscounts(sortedDiscounts);
      } catch (error) {
        console.error('Error fetching discounts:', error);
        setDiscounts([
          { _id: '1', name: "Upto 10,000", percentage: 10 },
          { _id: '2', name: "Upto 5,000", percentage: 8 },
          { _id: '3', name: "Upto 3,000", percentage: 5 },
          { _id: '4', name: "No Discount", percentage: 0 }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  // Find cart items with quantity > 0
  const cartProducts = Object.entries(cartItems)
    .filter(([_, quantity]) => quantity > 0)
    .map(([variantId, quantity]) => {
      for (const product of allProducts) {
        const variant = product.variants.find(v => v._id === variantId);
        if (variant) {
          return {
            product,
            variant,
            quantity
          };
        }
      }
      return null;
    })
    .filter(Boolean);

  // Calculate discount based on subtotal and fetched discounts
  const calculateDiscount = (subtotal) => {
    if (isLoading || discounts.length === 0) {
      return {
        id: null,
        name: "Loading...",
        percentage: 0,
        amount: 0
      };
    }

    const applicableDiscount = discounts.find(discount => {
      if (discount.name === "Upto 10,000" && subtotal >= 10000) return true;
      if (discount.name === "Upto 5,000" && subtotal >= 5000) return true;
      if (discount.name === "Upto 3,000" && subtotal >= 3000) return true;
      if (discount.name === "No Discount") return true;
      return false;
    }) || discounts[discounts.length - 1];

    return {
      id: applicableDiscount._id,
      name: applicableDiscount.name,
      percentage: applicableDiscount.percentage,
      amount: subtotal * (applicableDiscount.percentage / 100)
    };
  };

  const subtotal = getTotalCartAmount();
  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount.amount;

  const createOrder = async () => {
    try {
      setIsSubmitting(true);
      
      // Verify user is authenticated
      if (!user || !user._id) {
        throw new Error('User authentication required');
      }

      // Create the main order
      const orderResponse = await axios.post('http://localhost:4000/orders', {
        customerFk: user._id,
        total: subtotal,
        discountFk: discount.id,
        netAmount: total,
        paymentMethod
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const orderId = orderResponse.data.order._id;

      // Create order details
      await Promise.all(cartProducts.map(async ({ variant, quantity }) => {
        await axios.post('http://localhost:4000/order-details', {
          orderFk: orderId,
          productVariantFk: variant._id,
          quantity,
          price: variant.newPrice * quantity
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
      }));

      return orderId;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication
    if (!user) {
      await Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'Please login to complete your purchase',
        confirmButtonText: 'Go to Login'
      });
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (!paymentMethod) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Method Required',
        text: 'Please select a payment method',
      });
      return;
    }

    if (isSubmitting) return;

    try {
      const orderId = await createOrder();

      if (paymentMethod === 'Cash on Delivery') {
        await Swal.fire({
            icon: 'success',
            title: 'Order Placed!',
            html: `Order #${orderId.slice(-8)} for Rs.${total.toFixed(2)} created successfully. Pay on delivery.<br/>A confirmation email has been sent to ${user.email}.`,
            confirmButtonText: 'View Order'
        });
      } else {
        // Simulate card payment processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await Swal.fire({
            icon: 'success',
            title: 'Payment Complete!',
            html: `Payment of Rs.${total.toFixed(2)} for order #${orderId.slice(-8)} processed successfully.<br/>A confirmation email has been sent to ${user.email}.`,
            confirmButtonText: 'View Order'
        });
      }

      clearCart();
      navigate('/orders');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Checkout Failed',
        text: error.response?.data?.message || error.message || 'Checkout process failed',
      });
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'number') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiry' && value.length === 2 && !value.includes('/')) {
      setCardDetails(prev => ({
        ...prev,
        [name]: value + '/'
      }));
      return;
    }
    
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading discounts...</p>
      </div>
    );
  }

  return (
    <div className='checkout'>
      <h1>Checkout</h1>
      
      <div className="checkout-container">
        {/* Order Summary Section */}
        <div className="checkout-order-summary">
          <h2>Order Summary</h2>
          
          <div className="checkout-items">
            {cartProducts.length > 0 ? (
              cartProducts.map(({ product, variant, quantity }) => (
                <div key={`${product._id}-${variant._id}`} className="checkout-item">
                  <div className="checkout-item-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="checkout-item-details">
                    <h3>{product.name}</h3>
                    <p>Size: {variant.size}</p>
                    <p>Quantity: {quantity}</p>
                    <p>Price: Rs.{variant.newPrice.toFixed(2)}</p>
                  </div>
                  <div className="checkout-item-total">
                    <p>Rs.{(variant.newPrice * quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-cart-message">
                <p>Your cart is empty</p>
              </div>
            )}
          </div>
          
          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal:</span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            
            {discount.percentage > 0 && (
              <>
                <div className="checkout-total-row discount-row">
                  <span>Discount ({discount.name}):</span>
                  <span>- Rs.{discount.amount.toFixed(2)} ({discount.percentage}%)</span>
                </div>
                <hr/>
              </>
            )}
            
            <div className="checkout-total-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <hr/>
            <div className="checkout-total-row grand-total">
              <span>Total:</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Payment Method Section */}
        <div className="checkout-payment">
          <h2>Payment Method</h2>
          <form onSubmit={handlePaymentSubmit} className="payment-form">
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'Card Payment' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="Card Payment" 
                  checked={paymentMethod === 'Card Payment'}
                  onChange={() => setPaymentMethod('Card Payment')}
                />
                <div className="payment-option-content">
                  <span>Credit/Debit Card</span>
                  <div className="payment-icons">
                    <span>VISA</span>
                    <span>MasterCard</span>
                  </div>
                </div>
              </label>
              
              <label className={`payment-option ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="Cash on Delivery" 
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                />
                <div className="payment-option-content">
                  <span>Cash on Delivery</span>
                  <div className="payment-icon">
                    <span>Pay when you receive</span>
                  </div>
                </div>
              </label>
            </div>
            
            {paymentMethod === 'Card Payment' && (
              <div className="card-details-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="number"
                    value={cardDetails.number}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    value={cardDetails.name}
                    onChange={handleCardInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardDetails.expiry}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              className="payment-submit-btn"
              disabled={cartProducts.length === 0}
            >
              Complete Purchase
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;