import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import { useNavigate } from 'react-router-dom';

const CartItems = () => {
  const navigate = useNavigate();

  const {
    getTotalCartAmount,
    allProducts,
    cartItems,
    removeFromCart
  } = useContext(ShopContext);

  // Find cart items with quantity > 0
  const cartProducts = Object.entries(cartItems)
    .filter(([_, quantity]) => quantity > 0)
    .map(([variantId, quantity]) => {
      // Find the product and variant
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
    .filter(Boolean); // Remove any null entries

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Name</p>
        <p>Size</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr/>
      
      {cartProducts.length > 0 ? (
        cartProducts.map(({ product, variant, quantity }) => (
          <div key={`${product._id}-${variant._id}`}>
            <div className="cartitems-format cartitems-format-main">
              <img src={product.image} alt="" className='carticon-product-icon' />
              <p>{product.name}</p>
              <p>{variant.size}</p>
              <p>Rs.{variant.newPrice}</p>
              <button className='cartitems-quantity'>{quantity}</button>
              <p>Rs.{(variant.newPrice * quantity).toFixed(2)}</p>
              <img 
                className='cartitems-remove-icon' 
                src={remove_icon} 
                onClick={() => removeFromCart(variant._id)} 
                alt="Remove" 
              />
            </div>
            <hr/>
          </div>
        ))
      ) : (
        <div className="cart-empty">
          <p>Your cart is empty</p>
        </div>
      )}

      {cartProducts.length > 0 && (
        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
              <div className="cartitems-total-item">
                <p>Sub Total</p>
                <p>Rs.{getTotalCartAmount().toFixed(2)}</p>
              </div>
              <hr/>
              <div className="cartitems-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr/>
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>Rs.{getTotalCartAmount().toFixed(2)}</h3>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')}>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartItems;