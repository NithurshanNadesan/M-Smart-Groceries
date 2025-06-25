import React, { useState, useEffect } from "react";
import "../css/BrandsCategories.css";
import Swal from "sweetalert2";

const BrandsCategories = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState({ id: null, type: "" });
  const [editValue, setEditValue] = useState("");

  const [adding, setAdding] = useState({ type: "", isAdding: false });
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error("Failed to fetch brands", err));

    fetch("http://localhost:4000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  const handleEdit = (id, type, name) => {
    setEditing({ id, type });
    setEditValue(name);
  };

  const handleCancelEdit = () => {
    setEditing({ id: null, type: "" });
    setEditValue("");
  };

  const handleCancelAdd = () => {
    setAdding({ type: "", isAdding: false });
    setNewValue("");
  };

  const handleUpdate = async () => {
    if (editValue.trim() === "") return;

    try {
      const endpoint =
        editing.type === "brand"
          ? `http://localhost:4000/brands/${editing.id}`
          : `http://localhost:4000/categories/${editing.id}`;
      const key = editing.type === "brand" ? "brandName" : "categoryName";

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: editValue }),
      });

      if (!res.ok) throw new Error("Update failed");

      if (editing.type === "brand") {
        setBrands((prev) =>
          prev.map((b) =>
            b._id === editing.id ? { ...b, brandName: editValue } : b
          )
        );
      } else {
        setCategories((prev) =>
          prev.map((c) =>
            c._id === editing.id ? { ...c, categoryName: editValue } : c
          )
        );
      }

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${editing.type} has been updated successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });

      handleCancelEdit();
    } catch (err) {
      console.error("Failed to update", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while updating.",
      });
    }
  };

  const handleDelete = async (type, id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      width: "400px",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const endpoint =
          type === "brand"
            ? `http://localhost:4000/brands/${id}`
            : `http://localhost:4000/categories/${id}`;
        await fetch(endpoint, { method: "DELETE" });

        if (type === "brand") {
          setBrands(brands.filter((brand) => brand._id !== id));
        } else {
          setCategories(categories.filter((category) => category._id !== id));
        }

        Swal.fire("Deleted!", `${type} has been deleted.`, "success");
      }
    });
  };

  const startAdd = (type) => {
    setAdding({ type, isAdding: true });
    setNewValue("");
  };

  const handleAddSave = async () => {
    if (newValue.trim() === "") return;

    try {
      const endpoint =
        adding.type === "brand"
          ? `http://localhost:4000/brands`
          : `http://localhost:4000/categories`;
      const key = adding.type === "brand" ? "brandName" : "categoryName";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: newValue }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error("Add failed");

      if (adding.type === "brand") {
        setBrands((prev) => [...prev, { _id: data._id, brandName: newValue }]);
      } else {
        setCategories((prev) => [...prev, { _id: data._id, categoryName: newValue }]);
      }

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `${adding.type} has been added successfully.`
      });

      handleCancelAdd();
    } catch (err) {
      console.error("Failed to add", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while adding.",
      });
    }
  };

  return (
    <div className="brandCategory-container">
      <h3 id="page-name">Brands & Categories</h3>

      <h4>Brands</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Brand Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand, index) => (
            <tr key={brand._id}>
              <td>{index + 1}</td>
              <td>
                {editing.id === brand._id && editing.type === "brand" ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                ) : (
                  brand.brandName
                )}
              </td>
              <td>
                {editing.id === brand._id && editing.type === "brand" ? (
                  <>
                    <button className="save-btn" onClick={handleUpdate}>Update</button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                  <button className="edit-btn" onClick={() => handleEdit(brand._id, "brand", brand.brandName)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete("brand", brand._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {adding.isAdding && adding.type === "brand" && (
            <tr>
              <td>New</td>
              <td>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  autoFocus
                />
              </td>
              <td>
                <button className="save-btn" onClick={handleAddSave}>Save</button>
                <button className="cancel-btn" onClick={handleCancelAdd}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!adding.isAdding && (
        <button className="add-btn" onClick={() => startAdd("brand")}>Add Brand</button>
      )}

      <h4>Categories</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Category Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category._id}>
              <td>{index + 1}</td>
              <td>
                {editing.id === category._id && editing.type === "category" ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                ) : (
                  category.categoryName
                )}
              </td>
              <td>
                {editing.id === category._id && editing.type === "category" ? (
                  <>
                    <button className="save-btn" onClick={handleUpdate}>Update</button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                  <button className="edit-btn" onClick={() => handleEdit(category._id, "category", category.categoryName)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete("category", category._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {adding.isAdding && adding.type === "category" && (
            <tr>
              <td>New</td>
              <td>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  autoFocus
                />
              </td>
              <td>
                <button className="save-btn" onClick={handleAddSave}>Save</button>
                <button className="cancel-btn" onClick={handleCancelAdd}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!adding.isAdding && (
        <button className="add-btn" onClick={() => startAdd("category")}>Add Category</button>
      )}
    </div>
  );
};

export default BrandsCategories;
