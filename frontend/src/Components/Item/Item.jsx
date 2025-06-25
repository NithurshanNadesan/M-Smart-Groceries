// src/Components/Item/Item.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import './Item.css';
import Swal from 'sweetalert2';

const Item = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  if (!product) {
    return (
      <div className="item item-error">
        <div className="item-placeholder-image"></div>
        <p className="item-placeholder-name">Product not available</p>
      </div>
    );
  }

  const firstVariant = product.variants?.[0] || {
    _id: 'novariant',
    size: 'Standard',
    newPrice: 0,
    oldPrice: 0,
    stock: 0
  };

  const hasDiscount = firstVariant.oldPrice > firstVariant.newPrice;
  const isOutOfStock = firstVariant.stock <= 0;

  const handleProductClick = (e) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to view product details',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/loginSignup');
        }
      });
    }
    // If authenticated, the Link will handle navigation normally
  };

  const handleAddClick = () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to add products to cart',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/loginSignup');
        }
      });
    } else {
      navigate(`/product/${product._id}`);
    }
  };

  return (
    <div className={`item ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <Link 
        to={isAuthenticated ? `/product/${product._id}` : '#'}
        onClick={handleProductClick}
      >
        <img
          src={product.image || '/images/placeholder.jpg'}
          alt={product.name}
          className="item-image"
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
          }}
        />
      </Link>
      <p className="item-name">{product.name}</p>
      <p className="item-variant">{firstVariant.size}</p>
      <div className="item-prices">
        <span className="item-price-new">Rs. {firstVariant.newPrice.toFixed(2)}</span>
        {hasDiscount && (
          <span className="item-price-old">Rs. {firstVariant.oldPrice.toFixed(2)}</span>
        )}
      </div>
      <button
        className={`item-button ${isOutOfStock ? 'disabled' : ''}`}
        disabled={isOutOfStock}
        onClick={handleAddClick}
      >
        {isOutOfStock ? 'OUT OF STOCK' : 'ADD'}
      </button>
    </div>
  );
};

export default Item;