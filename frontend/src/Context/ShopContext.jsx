import React, { createContext, useState, useEffect } from 'react';
import { fetchAllProductsWithVariants } from '../services/api';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchAllProductsWithVariants();
        setAllProducts(products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (variantId, quantity = 1) => {
    setCartItems((prev) => ({
      ...prev,
      [variantId]: (prev[variantId] || 0) + quantity
    }));
  };

  const removeFromCart = (variantId) => {
    setCartItems((prev) => {
      const newQuantity = (prev[variantId] || 0) - 1;
      if (newQuantity <= 0) {
        const { [variantId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [variantId]: newQuantity
      };
    });
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [variantId, quantity]) => {
      if (quantity > 0) {
        for (const product of allProducts) {
          const variant = product.variants.find(v => v._id === variantId);
          if (variant) {
            return total + (variant.newPrice * quantity);
          }
        }
      }
      return total;
    }, 0);
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  // In your ShopContext
const clearCart = () => {
  setCartItems({});
};

  const contextValue = {
    allProducts,
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    clearCart
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;