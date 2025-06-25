import React, { useContext } from 'react';
import './Best.css';
import { ShopContext } from '../../Context/ShopContext';
import { AuthContext } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Best = () => {
  const { allProducts, loading } = useContext(ShopContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const getBestFreshItems = () => {
    if (!allProducts || allProducts.length === 0) return [];
    
    return allProducts
      .filter(product => {
        const category = product.categoryFk?.categoryName || 
                       product.categoryName || 
                       product.category;
        return category?.toLowerCase().includes('fresh');
      })
      .map(product => ({
        ...product,
        firstVariant: product.variants?.[0] || {
          _id: product._id || 'novariant',
          size: 'Standard',
          newPrice: product.price || 0,
          oldPrice: product.originalPrice || product.price || 0,
          stock: 0
        }
      }))
      .sort((a, b) => (b.firstVariant.stock || 0) - (a.firstVariant.stock || 0))
      .slice(0, 4);
  };

  const bestProducts = getBestFreshItems();

  const handleProductClick = (e, productId) => {
    if (!isAuthenticated) {
      e.preventDefault();
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to view product details',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    }
    // If authenticated, the Link will handle navigation normally
  };

  const handleAddClick = (productId) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to add products to cart',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    } else {
      navigate(`/product/${productId}`);
    }
  };

  if (loading) return <div className="best">Loading...</div>;
  if (bestProducts.length === 0) return <div className="best">No fresh items available</div>;

  return (
    <div className='best'>
      <h1>Best of Fruit & Veg</h1>
      <hr />
      <div className="best-item">
        {bestProducts.map((product) => {
          const { firstVariant } = product;
          const hasDiscount = firstVariant.oldPrice > firstVariant.newPrice;
          const isOutOfStock = firstVariant.stock <= 0;

          return (
            <div 
              key={product._id} 
              className={`item ${isOutOfStock ? 'out-of-stock' : ''}`}
            >
              <Link 
                to={isAuthenticated ? `/product/${product._id}` : '#'}
                onClick={(e) => handleProductClick(e, product._id)}
              >
                <img
                  src={product.image || '/images/placeholder.jpg'}
                  alt={product.name}
                  className="item-image"
                  id='item-image'
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
                onClick={() => handleAddClick(product._id)}
              >
                {isOutOfStock ? 'OUT OF STOCK' : 'ADD'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Best;