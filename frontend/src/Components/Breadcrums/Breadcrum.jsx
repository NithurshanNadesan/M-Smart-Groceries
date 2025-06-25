import React from 'react'
import './Breadcrum.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

const Breadcrum = ({ product }) => {
  // Safely get the category name
  const getCategoryName = () => {
    if (!product) return "SHOP";
    
    // Handle both populated category object and direct ID reference
    if (typeof product.categoryFk === 'object') {
      return product.categoryFk.categoryName || "SHOP";
    }
    
    // If you have a fallback category field (optional)
    return product.category || "SHOP";
  };

  const categoryName = getCategoryName();

  return (
    <div className='breadcrum'>
      HOME <img src={arrow_icon} alt='' /> 
      SHOP <img src={arrow_icon} alt='' /> 
      {categoryName.toUpperCase()} <img src={arrow_icon} alt='' /> 
      {product?.name?.toUpperCase() || "PRODUCT"}
    </div>
  );
};

export default Breadcrum;