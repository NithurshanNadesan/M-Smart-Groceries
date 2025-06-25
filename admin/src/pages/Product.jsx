import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Product.css";
import Swal from "sweetalert2";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [productRes, brandRes, categoryRes] = await Promise.all([
      axios.get("http://localhost:4000/products"),
      axios.get("http://localhost:4000/brands"),
      axios.get("http://localhost:4000/categories")
    ]);
    setProducts(productRes.data);
    setBrands(brandRes.data);
    setCategories(categoryRes.data);
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id) => {
    const updatedProduct = products.find((p) => p._id === id);
    
    try {
      await axios.put(`http://localhost:4000/products/${id}`, updatedProduct);
      setEditingId(null);
      fetchData();
      Swal.fire('Updated!', 'Your changes have been updated.', 'success');
    } catch {
      Swal.fire('Error!', 'Failed to save changes.', 'error');
    }
  };
  
  const handleDelete = async (id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the product permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
  
    if (result.isConfirmed) {
      await axios.delete(`http://localhost:4000/products/${id}`);
      fetchData();
      Swal.fire('Deleted!', 'The product has been deleted.', 'success');
    }
  };
  
  const handleAddProduct = () => {
    setNewProduct({
      name: "",
      brandFk: "",
      categoryFk: "",
      description: "",
      image: ""
    });
  };

  const handleSaveNewProduct = async () => {
    try {
      await axios.post("http://localhost:4000/products", newProduct);
      setNewProduct(null);
      fetchData();
      Swal.fire('Added!', 'The product has been added.', 'success');
    } catch {
      Swal.fire('Error!', 'Failed to add the product.', 'error');
    }
  };
  

  const handleChange = (id, field, value) => {
    if (id === "new") {
      setNewProduct({ ...newProduct, [field]: value });
    } else {
      setProducts(products.map(p =>
        p._id === id ? { ...p, [field]: value } : p
      ));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("product", file);

    try {
      const res = await axios.post("http://localhost:4000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const imageUrl = res.data.image_url;
      setNewProduct(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const renderSelect = (options, value, onChange) => (
    <select value={value} onChange={onChange}>
      <option value="">Select</option>
      {options.map(opt => (
        <option key={opt._id} value={opt._id}>
          {opt.brandName || opt.categoryName}
        </option>
      ))}
    </select>
  );

  return (
    <div className="product-container">
      <h3 id="page-name">Products</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Product Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Description</th>
            <th>Image</th>
            <th id="action-column">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>
              <td>
                {editingId === product._id ? (
                  <input
                    value={product.name}
                    onChange={(e) => handleChange(product._id, "name", e.target.value)}
                  />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {editingId === product._id ? (
                  renderSelect(brands, product.brandFk?._id || product.brandFk, (e) =>
                    handleChange(product._id, "brandFk", e.target.value)
                  )
                ) : (
                  product.brandFk?.brandName
                )}
              </td>
              <td>
                {editingId === product._id ? (
                  renderSelect(categories, product.categoryFk?._id || product.categoryFk, (e) =>
                    handleChange(product._id, "categoryFk", e.target.value)
                  )
                ) : (
                  product.categoryFk?.categoryName
                )}
              </td>
              <td>
                {editingId === product._id ? (
                  <input
                    value={product.description}
                    onChange={(e) =>
                      handleChange(product._id, "description", e.target.value)
                    }
                  />
                ) : (
                  product.description
                )}
              </td>
              <td>
                {editingId === product._id ? (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        const formData = new FormData();
                        formData.append("product", file);

                        try {
                          const res = await axios.post("http://localhost:4000/upload", formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                          });

                          const imageUrl = res.data.image_url;
                          handleChange(product._id, "image", imageUrl);
                        } catch (error) {
                          console.error("Image upload failed:", error);
                        }
                      }}
                    />
                    {product.image && (
                      <img src={product.image} alt="preview" width="50" style={{ marginTop: "5px" }} />
                    )}
                  </>
                ) : (
                  product.image ? <img src={product.image} alt="product" width="50" /> : "No Image"
                )}
              </td>
              <td>
                {editingId === product._id ? (
                  <>
                    <button className="save-btn" onClick={() => handleSave(product._id)}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => handleEdit(product._id)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                  </>
                )}
              </td>

            </tr>
          ))}

          {/* Inline Add Row */}
          {newProduct && (
            <tr>
              <td>#</td>
              <td>
                <input
                  value={newProduct.name}
                  onChange={(e) => handleChange("new", "name", e.target.value)}
                />
              </td>
              <td>
                {renderSelect(brands, newProduct.brandFk, (e) =>
                  handleChange("new", "brandFk", e.target.value)
                )}
              </td>
              <td>
                {renderSelect(categories, newProduct.categoryFk, (e) =>
                  handleChange("new", "categoryFk", e.target.value)
                )}
              </td>
              <td>
                <input
                  value={newProduct.description}
                  onChange={(e) => handleChange("new", "description", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {newProduct.image && (
                  <img src={newProduct.image} alt="preview" width="50" />
                )}
              </td>
              <td>
                <button className="save-btn" onClick={handleSaveNewProduct}>Add</button>
                <button className="cancel-btn" onClick={() => setNewProduct(null)}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!newProduct && (
        <button className="add-btn" onClick={handleAddProduct}>
          Add Product
        </button>
      )}
    </div>
  );
};

export default Product;
