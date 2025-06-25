// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

export const fetchAllProductsWithVariants = async () => {
  try {
    // Fetch all products
    const productsRes = await axios.get(`${API_BASE_URL}/products`);
    const products = productsRes.data || [];
    
    // Fetch variants for each product
    const productsWithVariants = await Promise.all(
      products.map(async (product) => {
        try {
          const variantsRes = await axios.get(
            `${API_BASE_URL}/product-variants/product/${product._id}`
          );
          return {
            ...product,
            variants: variantsRes.data || []
          };
        } catch (error) {
          console.error(`Error fetching variants for product ${product._id}:`, error);
          return {
            ...product,
            variants: []
          };
        }
      })
    );
    
    return productsWithVariants;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchSingleProductWithVariants = async (productId) => {
  try {
    const [productRes, variantsRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/products/${productId}`),
      axios.get(`${API_BASE_URL}/product-variants/product/${productId}`)
    ]);
    
    return {
      ...productRes.data,
      variants: variantsRes.data || []
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};