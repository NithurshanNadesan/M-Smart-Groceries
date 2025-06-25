import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';
import './CSS/ShopCategory.css';

const ShopCategory = ({ category }) => {
  const { allProducts, loading, error } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!allProducts.length) return;

    const isFilteringById = Array.isArray(category) 
      ? category.some(c => typeof c === 'string' && c.length === 24)
      : typeof category === 'string' && category.length === 24;

    const filterProducts = () => {
      let filtered = [];
      
      // First filter by category
      if (isFilteringById) {
        filtered = allProducts.filter(product => {
          if (!product?.categoryFk) return false;
          
          const productCategoryId = typeof product.categoryFk === 'object'
            ? product.categoryFk?._id?.toString()
            : product.categoryFk?.toString();
            
          return Array.isArray(category)
            ? category.some(catId => catId?.toString() === productCategoryId)
            : category?.toString() === productCategoryId;
        });
      } else {
        const categoriesToMatch = Array.isArray(category) 
          ? category.map(c => c?.toLowerCase?.().trim())
          : [category?.toLowerCase?.().trim()];
        
        filtered = allProducts.filter(product => {
          if (!product?.categoryFk) return false;
          
          const productCategoryName = typeof product.categoryFk === 'object'
            ? product.categoryFk?.categoryName?.toLowerCase?.().trim()
            : product.categoryFk?.toLowerCase?.().trim();
            
          return categoriesToMatch.includes(productCategoryName);
        });
      }

      // Then apply search filter if search term exists
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(product => {
          const productName = product?.name?.toLowerCase?.() || '';
          const description = product?.description?.toLowerCase?.() || '';
          return productName.includes(term) || description.includes(term);
        });
      }

      return filtered;
    };

    setFilteredProducts(filterProducts());
  }, [allProducts, category, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div className="shop-category-loading">Loading products...</div>;
  }

  if (error) {
    return <div className="shop-category-error">Error: {error}</div>;
  }

  return (
    <div className="shop-category">
      <div className="shopcategory-indexSort">
      {filteredProducts.length > 0 && (
          <p>
            <span>Showing {filteredProducts.length}</span> products
          </p>
        )}
        <div className="shopcategory-search">
          <input 
            type="text" 
            placeholder="Search in this category..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div> 
      {filteredProducts.length === 0 ? (
        <div className="shop-category-empty">
          {searchTerm ? (
            `No products found matching "${searchTerm}"`
          ) : (
            'No products found in this category'
          )}
        </div>
      ) : (
        <div className="shopcategory-products">
          {filteredProducts.map((product) => (
            <Item key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopCategory;