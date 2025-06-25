import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSingleProductWithVariants } from '../services/api';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await fetchSingleProductWithVariants(productId);
        if (!productData) {
          throw new Error('Product not found');
        }
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  if (loading) {
    return <div className="product-loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="product-error">Error: {error}</div>;
  }

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

  return (
    <div className="product-page">
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
    </div>
  );
};

export default Product;