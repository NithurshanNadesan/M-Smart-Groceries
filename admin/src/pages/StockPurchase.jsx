import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../css/StockPurchase.css";

const StockPurchase = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [_admins, setAdmins] = useState([]);
  const [stockPurchases, setStockPurchases] = useState([]);
  const [stockPurchaseDetails, setStockPurchaseDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Editing states
  const [editingPurchaseId, setEditingPurchaseId] = useState(null);
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [editedPurchase, setEditedPurchase] = useState({
    supplierFk: "",
    adminFk: "",
    date: "",
    status: "",
    totalAmount: ""
  });
  const [editedDetail, setEditedDetail] = useState({
    stockPurchaseFk: "",
    productVariantFk: "",
    quantity: "",
    amount: ""
  });

  // Adding states
  const [addingPurchase, setAddingPurchase] = useState(false);
  const [addingDetail, setAddingDetail] = useState(false);
  const [newStockPurchase, setNewStockPurchase] = useState({
    supplierFk: "",
    adminFk: localStorage.getItem("adminId") || "",
    date: new Date().toISOString().split('T')[0],
    status: "Pending",
    totalAmount: ""
  });
  const [newStockPurchaseDetail, setNewStockPurchaseDetail] = useState({
    stockPurchaseFk: stockPurchases[0]?._id || "",
    productVariantFk: "",
    quantity: "",
    amount: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, variantsRes, adminsRes, purchasesRes] = await Promise.all([
          fetch("http://localhost:4000/suppliers"),
          fetch("http://localhost:4000/product-variants"),
          fetch("http://localhost:4000/admins"),
          fetch("http://localhost:4000/stock-purchase")
        ]);

        const suppliersData = await suppliersRes.json();
        const variantsData = await variantsRes.json();
        const adminsData = await adminsRes.json();
        const purchasesData = await purchasesRes.json();

        setSuppliers(suppliersData);
        console.log("Product Variants Data:", variantsData);
        setProductVariants(variantsData);
        setAdmins(adminsData);
        setStockPurchases(purchasesData);

        // Fetch details for each purchase
        const detailsPromises = purchasesData.map(purchase => 
          fetch(`http://localhost:4000/stock-purchase-details/stock-purchase/${purchase._id}`)
            .then(res => res.json())
        );
        const detailsData = await Promise.all(detailsPromises);
        setStockPurchaseDetails(detailsData.flat());
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "Failed to load data", "error");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const showSuccessAlert = (title, message) => {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
    });
  };

  // Purchase CRUD operations
  const handleEditPurchase = (purchase) => {
    setEditingPurchaseId(purchase._id);
    setEditedPurchase({
      supplierFk: purchase.supplierFk._id || purchase.supplierFk,
      adminFk: purchase.adminFk._id || purchase.adminFk,
      date: new Date(purchase.date).toISOString().split('T')[0],
      status: purchase.status,
      totalAmount: purchase.totalAmount
    });
  };

  const handleUpdatePurchase = async () => {
    try {
      if (!editedPurchase.supplierFk || !editedPurchase.adminFk || 
          !editedPurchase.date || !editedPurchase.status || !editedPurchase.totalAmount) {
        Swal.fire("Error", "Please fill all required fields", "error");
        return;
      }

      const res = await fetch(`http://localhost:4000/stock-purchase/${editingPurchaseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedPurchase),
      });
      
      if (!res.ok) throw new Error("Update failed");

      const updatedPurchase = await res.json();
      setStockPurchases(prev =>
        prev.map(p => p._id === editingPurchaseId ? updatedPurchase.stockPurchase : p)
      );
      setEditingPurchaseId(null);
      showSuccessAlert("Updated!","Purchase updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update purchase", "error");
    }
  };

  // Detail CRUD operations
  const handleEditDetail = (detail) => {
    setEditingDetailId(detail._id);
    setEditedDetail({
      stockPurchaseFk: detail.stockPurchaseFk._id || detail.stockPurchaseFk,
      productVariantFk: detail.productVariantFk._id || detail.productVariantFk,
      quantity: detail.quantity,
      amount: detail.amount
    });
  };

  const handleUpdateDetail = async () => {
    try {
      if (!editedDetail.stockPurchaseFk || !editedDetail.productVariantFk || 
          !editedDetail.quantity || !editedDetail.amount) {
        Swal.fire("Error", "Please fill all required fields", "error");
        return;
      }

      const res = await fetch(`http://localhost:4000/stock-purchase-details/${editingDetailId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedDetail),
      });
      
      if (!res.ok) throw new Error("Update failed");

      // Fetch the updated detail with populated references
    const detailRes = await fetch(`http://localhost:4000/stock-purchase-details/${editingDetailId}`);
    const fullDetail = await detailRes.json();

    setStockPurchaseDetails(prev =>
      prev.map(d => d._id === editingDetailId ? fullDetail : d)
    );
      setEditingDetailId(null);
      showSuccessAlert("Updated!","Detail updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update detail", "error");
    }
  };

  const cancelEdit = () => {
    setEditingPurchaseId(null);
    setEditingDetailId(null);
  };

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
          const url = type === "purchase" 
            ? `http://localhost:4000/stock-purchase/${id}`
            : `http://localhost:4000/stock-purchase-details/${id}`;
          
          await fetch(url, { method: "DELETE" });

          if (type === "purchase") {
            setStockPurchases(prev => prev.filter(p => p._id !== id));
            setStockPurchaseDetails(prev => prev.filter(d => d.stockPurchaseFk !== id));
          } else {
            setStockPurchaseDetails(prev => prev.filter(d => d._id !== id));
          }

          Swal.fire("Deleted!", "The purchase has been deleted.", "success");
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error", "Failed to delete", "error");
        }
      }
    });
  };

  const startAddPurchase = () => {
    setAddingPurchase(true);
    setNewStockPurchase({
      supplierFk: "",
      adminFk: localStorage.getItem("adminId") || "",
      date: new Date().toISOString().split('T')[0],
      status: "Pending",
      totalAmount: ""
    });
  };

  const startAddDetail = () => {
    setAddingDetail(true);
    setNewStockPurchaseDetail({
      stockPurchaseFk: stockPurchases[0]?._id || "",
      productVariantFk: "",
      quantity: "",
      amount: ""
    });
  };

  const cancelAdd = () => {
    setAddingPurchase(false);
    setAddingDetail(false);
  };

  const handleAddPurchase = async () => {
    try {
      if (!newStockPurchase.supplierFk || !newStockPurchase.adminFk || 
          !newStockPurchase.date || !newStockPurchase.status || !newStockPurchase.totalAmount) {
        Swal.fire("Error", "Please fill all required fields", "error");
        return;
      }
  
      if (!newStockPurchase.adminFk) {
        Swal.fire("Error", "Admin ID not found. Please log in again.", "error");
        return;
      }
  
      const res = await fetch("http://localhost:4000/stock-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStockPurchase),
      });
      
      if (!res.ok) throw new Error("Failed to save purchase");
  
      const data = await res.json();
      setStockPurchases(prev => [...prev, data.stockPurchase]);
      setAddingPurchase(false);
      
      showSuccessAlert("Saved!","Purchase added successfully");

      
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire("Error", `Failed to save: ${error.message}`, "error");
    }
  };

  const handleAddDetail = async () => {
    try {
      if (!newStockPurchaseDetail.stockPurchaseFk || !newStockPurchaseDetail.productVariantFk || 
          !newStockPurchaseDetail.quantity || !newStockPurchaseDetail.amount) {
        Swal.fire("Error", "Please fill all required fields", "error");
        return;
      }

      const res = await fetch("http://localhost:4000/stock-purchase-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStockPurchaseDetail),
      });
      
      if (!res.ok) throw new Error("Failed to save detail");

      const data = await res.json();
      // Fetch the newly added detail with populated references
      const detailRes = await fetch(`http://localhost:4000/stock-purchase-details/${data.stockPurchaseDetail._id}`);
      const fullDetail = await detailRes.json();

      setStockPurchaseDetails(prev => [...prev, fullDetail]);
      setAddingDetail(false);
      showSuccessAlert("Added!","Detail added successfully");
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire("Error", `Failed to save: ${error.message}`, "error");
    }
  };

  if (isLoading) return <div className="loading">Loading data...</div>;

  return (
    <div className="stock-purchase-container">
      <h3>Stock Purchases</h3>
      
      {/* Stock Purchases Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th id="action-column">Action</th>
          </tr>
        </thead>
        <tbody>
          {stockPurchases.map((purchase, index) => (
            <tr key={purchase._id}>
              <td>{index + 1}</td>
              {editingPurchaseId === purchase._id ? (
                <>
                  <td>
                    <select
                      value={editedPurchase.supplierFk}
                      onChange={(e) => setEditedPurchase({...editedPurchase, supplierFk: e.target.value})}
                      className="form-input"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map(s => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="date"
                      value={editedPurchase.date}
                      onChange={(e) => setEditedPurchase({...editedPurchase, date: e.target.value})}
                      className="form-input"
                    />
                  </td>
                  <td>
                    <select
                      value={editedPurchase.status}
                      onChange={(e) => setEditedPurchase({...editedPurchase, status: e.target.value})}
                      className="form-input"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editedPurchase.totalAmount}
                      onChange={(e) => setEditedPurchase({...editedPurchase, totalAmount: e.target.value})}
                      className="form-input"
                    />
                  </td>
                  <td>
                    <button className="save-btn" onClick={handleUpdatePurchase}>Save</button>
                    <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{purchase.supplierFk?.name || "Unknown"}</td>
                  <td>{new Date(purchase.date).toLocaleDateString()}</td>
                  <td>{purchase.status}</td>
                  <td>{purchase.totalAmount}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditPurchase(purchase)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete("purchase", purchase._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {addingPurchase && (
            <tr>
              <td>New</td>
              <td>
                <select
                  value={newStockPurchase.supplierFk}
                  onChange={(e) => setNewStockPurchase({...newStockPurchase, supplierFk: e.target.value})}
                  className="form-input"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="date"
                  value={newStockPurchase.date}
                  onChange={(e) => setNewStockPurchase({...newStockPurchase, date: e.target.value})}
                  className="form-input"
                />
              </td>
              <td>
                <select
                  value={newStockPurchase.status}
                  onChange={(e) => setNewStockPurchase({...newStockPurchase, status: e.target.value})}
                  className="form-input"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={newStockPurchase.totalAmount}
                  onChange={(e) => setNewStockPurchase({...newStockPurchase, totalAmount: e.target.value})}
                  className="form-input"
                />
              </td>
              <td>
                <button className="save-btn" onClick={handleAddPurchase}>Save</button>
                <button className="cancel-btn" onClick={cancelAdd}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {!addingPurchase && (
        <button className="add-btn" onClick={startAddPurchase}>Add Purchase</button>
      )}

      {/* Stock Purchase Details Table */}
      <h3>Stock Purchase Details</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Purchase ID</th>
            <th>Product Variant</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th id="action-column">Action</th>
          </tr>
        </thead>
        <tbody>
          {stockPurchaseDetails.map((detail, index) => (
            <tr key={detail._id}>
              <td>{index + 1}</td>
              <td>{detail.stockPurchaseFk?._id || detail.stockPurchaseFk || "N/A"}</td>
              {editingDetailId === detail._id ? (
                <>
                  <td>
                    <select
                      value={editedDetail.productVariantFk}
                      onChange={(e) => setEditedDetail({...editedDetail, productVariantFk: e.target.value})}
                      className="form-input"
                    >
                      <option value="">Select Product Variant</option>
                      {productVariants.map(pv => (
                        <option key={pv._id} value={pv._id}>
                        {pv.productFk?.name || "Unnamed Product"} {pv.size ? `(${pv.size})` : ""}
                      </option>                      
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editedDetail.quantity}
                      onChange={(e) => setEditedDetail({...editedDetail, quantity: e.target.value})}
                      className="form-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editedDetail.amount}
                      onChange={(e) => setEditedDetail({...editedDetail, amount: e.target.value})}
                      className="form-input"
                    />
                  </td>
                  <td>
                    <button className="save-btn" onClick={handleUpdateDetail}>Save</button>
                    <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>
                    {detail.productVariantFk 
                      ? `${detail.productVariantFk.productFk?.name || ''} ${detail.productVariantFk.size || ''}`.trim() 
                      : "Unknown"
                    }
                  </td>

                  <td>{detail.quantity}</td>
                  <td>{detail.amount}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditDetail(detail)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete("detail", detail._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {addingDetail && (
            <tr>
              <td>New</td>
              <td>
                <select
                  value={newStockPurchaseDetail.stockPurchaseFk}
                  onChange={(e) => setNewStockPurchaseDetail({...newStockPurchaseDetail, stockPurchaseFk: e.target.value})}
                  className="form-input"
                >
                  <option value="">Select Purchase</option>
                  {stockPurchases.map(p => (
                    <option key={p._id} value={p._id}>{p._id} - {p.supplierFk?.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={newStockPurchaseDetail.productVariantFk}
                  onChange={(e) =>
                    setNewStockPurchaseDetail({
                      ...newStockPurchaseDetail,
                      productVariantFk: e.target.value,
                    })
                  }
                  className="form-input"
                >
                  <option value="">Select Product Variant</option>
                  {productVariants.map((pv) => (
                    <option key={pv._id} value={pv._id}>
                      {pv.productFk?.name || ''} {pv.size ? pv.size : ''}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                <input
                  type="number"
                  value={newStockPurchaseDetail.quantity}
                  onChange={(e) => setNewStockPurchaseDetail({...newStockPurchaseDetail, quantity: e.target.value})}
                  className="form-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={newStockPurchaseDetail.amount}
                  onChange={(e) => setNewStockPurchaseDetail({...newStockPurchaseDetail, amount: e.target.value})}
                  className="form-input"
                />
              </td>
              <td>
                <button className="save-btn" onClick={handleAddDetail}>Save</button>
                <button className="cancel-btn" onClick={cancelAdd}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!addingDetail && (
        <button className="add-btn" onClick={startAddDetail}>Add Purchase Detail</button>
      )}
    </div>
  );
};

export default StockPurchase;