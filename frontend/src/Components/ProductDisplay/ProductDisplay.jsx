import React, { useContext, useState, useEffect } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Initialize selected variant when product loads or changes
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    // Reset quantity when variant changes to ensure it doesn't exceed new stock
    setQuantity(1);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(selectedVariant._id, quantity);
    }
  };

  if (!product) return <div>Product not found</div>;

  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img">
          <img 
            className='productdisplay-main-img' 
            src={product.image} 
            alt={product.name}
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
          />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        
        {/* Brand and Category */}
        <p className="productdisplay-right-category">
          <span>Brand:</span> {product.brandFk?.brandName || 'N/A'}
        </p>
        <p className="productdisplay-right-category">
          <span>Category:</span> {product.categoryFk?.categoryName || product.category || 'N/A'}
        </p>

        {/* Dynamic description */}
        <div className="productdisplay-right-description">
          <p>{product.description || 'Product description not available'}</p>
        </div>

        {/* Variant selection */}
        {product.variants?.length > 0 && (
          <div className="productdisplay-right-size">
            <h1>Select {product.variants.length > 1 ? 'Variant' : 'Size'}</h1>
            <div className="productdisplay-right-sizes">
              {product.variants.map((variant) => (
                <div
                  key={variant._id}
                  className={`variant-option ${
                    selectedVariant?._id === variant._id ? 'selected' : ''
                  } ${variant.stock <= 0 ? 'out-of-stock' : ''}`}
                  onClick={() => variant.stock > 0 && handleVariantSelect(variant)}
                  title={variant.stock <= 0 ? 'Out of stock' : ''}
                >
                  {variant.size}
                  {variant.stock <= 0 && <span className="stock-badge">X</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price display */}
        <div className="productdisplay-right-prices">
          {selectedVariant ? (
            <>
              <div className="productdisplay-right-price-new">
                Rs. {selectedVariant.newPrice.toFixed(2)}
              </div>
              {selectedVariant.oldPrice > selectedVariant.newPrice && (
                <div className="productdisplay-right-price-old">
                  Rs. {selectedVariant.oldPrice.toFixed(2)}
                </div>
              )}
            </>
          ) : (
            <div className="price-not-available">Price not available</div>
          )}
        </div>

        {/* Quantity selector */}
        <div className="productdisplay-action-container">
        <div className="productdisplay-quantity">
          <button 
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span>{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= (selectedVariant?.stock || 0)}
          >
            +
          </button>
          {selectedVariant && (
            <span className="stock-info">
              {selectedVariant.stock} available
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button 
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock <= 0}
          className={!selectedVariant || selectedVariant.stock <= 0 ? 'disabled' : ''}
          id='add-to-cart-btn'
        >
          {!selectedVariant ? 'SELECT OPTION' : 
           selectedVariant.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
        </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;