import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ProductVariant.module.css";
import Swal from 'sweetalert2';

const ProductVariant = () => {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newVariant, setNewVariant] = useState(null);
  const [originalVariant, setOriginalVariant] = useState(null); // To store original values for cancel

  // Fetch all product variants
  const fetchVariants = async () => {
    try {
      const res = await axios.get("http://localhost:4000/product-variants");
      setVariants(res.data);
    } catch (err) {
      console.error("Failed to fetch variants:", err);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchVariants();
    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    const variantToEdit = variants.find(v => v._id === id);
    setOriginalVariant(variantToEdit); // Store original values
    setEditingId(id);
  };

  const cancelEdit = () => {
    if (originalVariant) {
      // Restore original values
      setVariants(variants.map(v => 
        v._id === originalVariant._id ? originalVariant : v
      ));
    }
    setEditingId(null);
    setOriginalVariant(null);
  };

  const cancelAdd = () => {
    setNewVariant(null);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This variant will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:4000/product-variants/${id}`);
        fetchVariants();
        Swal.fire('Deleted!', 'Product variant has been deleted.', 'success');
      } catch (err) {
        console.error("Failed to delete variant:", err);
        Swal.fire('Error', 'Something went wrong while deleting.', 'error');
      }
    }
  };
  

  const handleSave = async (id) => {
    const variant = variants.find(v => v._id === id);
    try {
      await axios.put(`http://localhost:4000/product-variants/${id}`, variant);
      setEditingId(null);
      setOriginalVariant(null);
      fetchVariants();
      Swal.fire('Updated!', 'Product variant updated successfully.', 'success');
    } catch (err) {
      console.error("Failed to update variant:", err);
      Swal.fire('Error', 'Update failed. Please try again.', 'error');
    }
  };
  

  const handleAdd = async () => {
    if (!newVariant.productFk || !newVariant.size) {
      Swal.fire('Missing fields', 'Product and size are required', 'warning');
      return;
    }

    try {
      await axios.post("http://localhost:4000/product-variants", newVariant);
      setNewVariant(null);
      fetchVariants();
      Swal.fire('Added!', 'New product variant added.', 'success');
    } catch (err) {
      console.error("Failed to add variant:", err);
      Swal.fire('Error', 'Add failed. Please check your data.', 'error');
    }
  };
  

  const handleChange = (id, field, value, isNew = false) => {
    if (isNew) {
      setNewVariant({ ...newVariant, [field]: value });
    } else {
      setVariants(variants.map(v =>
        v._id === id ? { ...v, [field]: value } : v
      ));
    }
  };

  return (
    <div className="product-container">
      <h3 id="page-name">Product Variants</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Product</th>
            <th>Size</th>
            <th>New Price</th>
            <th>Old Price</th>
            <th>Stock</th>
            <th id="action-column">Action</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v, index) => (
            <tr key={v._id}>
              <td>{index + 1}</td>
              <td>
                {editingId === v._id ? (
                  <select
                    value={v.productFk}
                    onChange={(e) => handleChange(v._id, "productFk", e.target.value)}
                  >
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                ) : (
                   v.productFk?.name || "-"
                )}
              </td>
              <td>
                {editingId === v._id ? (
                  <input
                    type="text"
                    value={v.size}
                    onChange={(e) => handleChange(v._id, "size", e.target.value)}
                  />
                ) : (
                  v.size
                )}
              </td>
              <td>
                {editingId === v._id ? (
                  <input
                    type="number"
                    value={v.newPrice}
                    onChange={(e) => handleChange(v._id, "newPrice", e.target.value)}
                  />
                ) : (
                  v.newPrice
                )}
              </td>
              <td>
                {editingId === v._id ? (
                  <input
                    type="number"
                    value={v.oldPrice}
                    onChange={(e) => handleChange(v._id, "oldPrice", e.target.value)}
                  />
                ) : (
                  v.oldPrice
                )}
              </td>
              <td>
                {editingId === v._id ? (
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => handleChange(v._id, "stock", e.target.value)}
                  />
                ) : (
                  v.stock
                )}
              </td>
              <td>
                {editingId === v._id ? (
                  <>
                    <button className="save-btn" onClick={() => handleSave(v._id)}>
                      Save
                    </button>
                    <button 
                      className="cancel-btn" 
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                  <button className="edit-btn" onClick={() => handleEdit(v._id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(v._id)}>
                  Delete
                </button>
                </>
                )}
                
              </td>
            </tr>
          ))}

          {newVariant && (
            <tr>
              <td>#</td>
              <td>
                <select
                  value={newVariant.productFk || ""}
                  onChange={(e) => handleChange(null, "productFk", e.target.value, true)}
                >
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={newVariant.size || ""}
                  onChange={(e) => handleChange(null, "size", e.target.value, true)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={newVariant.newPrice || ""}
                  onChange={(e) => handleChange(null, "newPrice", e.target.value, true)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={newVariant.oldPrice || ""}
                  onChange={(e) => handleChange(null, "oldPrice", e.target.value, true)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={newVariant.stock || ""}
                  onChange={(e) => handleChange(null, "stock", e.target.value, true)}
                />
              </td>
              <td>
                <button className="save-btn" onClick={handleAdd}>Add</button>
                <button 
                  className="cancel-btn" 
                  onClick={cancelAdd}
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!newVariant && (
        <button className="add-btn" onClick={() => setNewVariant({})}>
          Add Product Variant
        </button>
      )}
    </div>
  );
};

export default ProductVariant;