import React, { useEffect, useState } from "react";
import "../css/SupplierDetails.css";
import Swal from "sweetalert2";

const SupplierDetails = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [mobiles, setMobiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [editingMobileId, setEditingMobileId] = useState(null);

  const [editedSupplier, setEditedSupplier] = useState({ name: "", email: "", address: "" });
  const [editedMobile, setEditedMobile] = useState({ supplierFk: "", mobileNumber: "" });

  const [adding, setAdding] = useState({ type: "", isAdding: false });
  const [newSupplier, setNewSupplier] = useState({ name: "", email: "", address: "" });
  const [newMobile, setNewMobile] = useState({ supplierFk: "", mobileNumber: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, mobilesRes] = await Promise.all([
          fetch("http://localhost:4000/suppliers"),
          fetch("http://localhost:4000/supplier-mobiles")
        ]);
        
        const suppliersData = await suppliersRes.json();
        const mobilesData = await mobilesRes.json();
        
        setSuppliers(suppliersData);
        setMobiles(mobilesData);
        setIsLoading(false);
        
        // Debug logs
        console.log("Suppliers:", suppliersData);
        console.log("Mobiles:", mobilesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "Failed to load data", "error");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDelete = (type, id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You can't undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const url =
            type === "supplier"
              ? `http://localhost:4000/suppliers/${id}`
              : `http://localhost:4000/supplier-mobiles/${id}`;
          
          const res = await fetch(url, { method: "DELETE" });
          
          if (!res.ok) throw new Error("Delete failed");

          if (type === "supplier") {
            setSuppliers(suppliers.filter((s) => s._id !== id));
          } else {
            setMobiles(mobiles.filter((m) => m._id !== id));
          }

          Swal.fire("Deleted!", "", "success");
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error", "Failed to delete", "error");
        }
      }
    });
  };

  const startAdd = (type) => {
    setAdding({ type, isAdding: true });
  };

  const cancelAdd = () => {
    setAdding({ type: "", isAdding: false });
    setNewSupplier({ name: "", email: "", address: "" });
    setNewMobile({ supplierFk: "", mobileNumber: "" });
  };

  const cancelEdit = () => {
    setEditingSupplierId(null);
    setEditingMobileId(null);
  };

  const handleAddSave = async () => {
    try {
      if (adding.type === "supplier") {
        if (!newSupplier.name || !newSupplier.email || !newSupplier.address) {
          Swal.fire("Error", "Please fill all supplier fields", "error");
          return;
        }
  
        const res = await fetch("http://localhost:4000/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSupplier),
        });
        
        // First check if the response is OK
        if (!res.ok) throw new Error("Failed to save supplier");
        
        const data = await res.json();
        setSuppliers(prev => [...prev, { 
          _id: data._id || data.supplier._id, 
          name: newSupplier.name, 
          email: newSupplier.email, 
          address: newSupplier.address 
        }]);
        setNewSupplier({ name: "", email: "", address: "" });
        
        // Show success alert AFTER successful operation
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Supplier has been added successfully.",
        });
      } else {
        if (!newMobile.supplierFk || !newMobile.mobileNumber) {
          Swal.fire("Error", "Please select a supplier and enter a mobile number", "error");
          return;
        }
  
        const res = await fetch("http://localhost:4000/supplier-mobiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supplierFk: newMobile.supplierFk,
            mobileNumber: newMobile.mobileNumber
          }),
        });
        
        if (!res.ok) throw new Error("Failed to save mobile");
        
        const data = await res.json();
        const supplier = suppliers.find(s => s._id === newMobile.supplierFk);
        
        setMobiles(prev => [...prev, { 
          _id: data._id || data.supplierMobile._id,
          supplierFk: {
            _id: newMobile.supplierFk,
            name: supplier?.name || ""
          },
          mobileNumber: newMobile.mobileNumber
        }]);
        setNewMobile({ supplierFk: "", mobileNumber: "" });
        
        // Show success alert for mobile
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Mobile number has been added successfully.",
        });
      }
      setAdding({ type: "", isAdding: false });
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire("Error", `Failed to save: ${error.message}`, "error");
    }
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplierId(supplier._id);
    setEditedSupplier({ 
      name: supplier.name, 
      email: supplier.email, 
      address: supplier.address 
    });
  };

  const handleUpdateSupplier = async () => {
    try {
      const res = await fetch(`http://localhost:4000/suppliers/${editingSupplierId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedSupplier),
      });
      
      if (!res.ok) throw new Error("Update failed");

      setSuppliers((prev) =>
        prev.map((s) => (s._id === editingSupplierId ? { ...s, ...editedSupplier } : s))
      );
      setEditingSupplierId(null);
      // Show success alert for mobile
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Supplier updated successfully!",
      });
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update supplier", "error");
    }
  };

  const handleEditMobile = (mobile) => {
    setEditingMobileId(mobile._id);
    setEditedMobile({ 
      supplierFk: mobile.supplierFk?._id || mobile.supplierFk, 
      mobileNumber: mobile.mobileNumber 
    });
  };

  const handleUpdateMobile = async () => {
    try {
      const res = await fetch(`http://localhost:4000/supplier-mobiles/${editingMobileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedMobile),
      });
      
      if (!res.ok) throw new Error("Update failed");

      setMobiles((prev) =>
        prev.map((m) => 
          m._id === editingMobileId ? { ...m, ...editedMobile } : m
        )
      );
      setEditingMobileId(null);
      // Show success alert for mobile
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Supplier Mobile updated successfully!",
      });
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update mobile number", "error");
    }
  };

  if (isLoading) return <div className="loading">Loading data...</div>;

  return (
    <div className="supplier-container">
      <h3>Suppliers</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th id="action-column">Action</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s, index) => (
            <tr key={s._id}>
              <td>{index + 1}</td>
              {editingSupplierId === s._id ? (
                <>
                  <td><input value={editedSupplier.name} onChange={(e) => setEditedSupplier({ ...editedSupplier, name: e.target.value })} /></td>
                  <td><input value={editedSupplier.email} onChange={(e) => setEditedSupplier({ ...editedSupplier, email: e.target.value })} /></td>
                  <td><input value={editedSupplier.address} onChange={(e) => setEditedSupplier({ ...editedSupplier, address: e.target.value })} /></td>
                  <td>
                    <button className="save-btn" onClick={handleUpdateSupplier}>Save</button>
                    <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditSupplier(s)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete("supplier", s._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {adding.type === "supplier" && (
            <tr>
              <td>New</td>
              <td><input value={newSupplier.name} onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} /></td>
              <td><input value={newSupplier.email} onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })} /></td>
              <td><input value={newSupplier.address} onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })} /></td>
              <td>
                <button className="save-btn" onClick={handleAddSave}>Save</button>
                <button className="cancel-btn" onClick={cancelAdd}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!adding.isAdding && <button className="add-btn" onClick={() => startAdd("supplier")}>Add Supplier</button>}

      <h3>Supplier Mobile Numbers</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Supplier</th>
            <th>Mobile</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {mobiles.map((m, index) => (
            <tr key={m._id}>
              <td>{index + 1}</td>
              {editingMobileId === m._id ? (
                <>
                  <td>
                    <select 
                      value={editedMobile.supplierFk} 
                      onChange={(e) => setEditedMobile({ ...editedMobile, supplierFk: e.target.value })}
                    >
                      <option value="">Select</option>
                      {suppliers.map((s) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input 
                      value={editedMobile.mobileNumber} 
                      onChange={(e) => setEditedMobile({ ...editedMobile, mobileNumber: e.target.value })} 
                    />
                  </td>
                  <td>
                    <button className="save-btn" onClick={handleUpdateMobile}>Save</button>
                    <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>
                    {m.supplierFk?.name || suppliers.find(s => s._id === m.supplierFk)?.name || "Unknown"}
                  </td>
                  <td>{m.mobileNumber}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditMobile(m)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete("mobile", m._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {adding.type === "mobile" && (
            <tr>
              <td>New</td>
              <td>
                <select 
                  value={newMobile.supplierFk} 
                  onChange={(e) => setNewMobile({ ...newMobile, supplierFk: e.target.value })}
                >
                  <option value="">Select</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <input 
                  value={newMobile.mobileNumber} 
                  onChange={(e) => setNewMobile({ ...newMobile, mobileNumber: e.target.value })} 
                />
              </td>
              <td>
                <button className="save-btn" onClick={handleAddSave}>Save</button>
                <button className="cancel-btn" onClick={cancelAdd}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!adding.isAdding && <button className="add-btn" onClick={() => startAdd("mobile")}>Add Mobile</button>}
    </div>
  );
};

export default SupplierDetails;