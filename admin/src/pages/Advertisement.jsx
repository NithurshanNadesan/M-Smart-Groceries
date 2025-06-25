import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "../css/Advertisement.css";

const API_URL = "http://localhost:4000/ads";
const UPLOAD_URL = "http://localhost:4000/upload";

const Advertisement = () => {
  const [ads, setAds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newAdTitle, setNewAdTitle] = useState("");
  const [newAdImage, setNewAdImage] = useState(null);
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get(API_URL);
      setAds(res.data);
    } catch (error) {
      console.error("Error fetching ads", error);
    }
  };

  const handleEdit = (ad) => {
    setEditingId(ad._id);
    setEditTitle(ad.title);
    setEditImage(null); // Reset image input
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditImage(null);
  };

  const handleUpdate = async (id) => {
    try {
      let imageUrl = ads.find((ad) => ad._id === id).image;

      if (editImage) {
        const formData = new FormData();
        formData.append("product", editImage);
        const uploadRes = await axios.post(UPLOAD_URL, formData);
        imageUrl = uploadRes.data.image_url;
      }

      const res = await axios.put(`${API_URL}/${id}`, {
        title: editTitle,
        image: imageUrl,
        adminFk: adminId,
      });

      const updatedAds = ads.map((ad) =>
        ad._id === id ? res.data.ad : ad
      );
      setAds(updatedAds);
      setEditingId(null);
      Swal.fire('Updated!', 'Your changes have been updated.', 'success');
    } catch (error) {
      console.error("Update error", error);
      Swal.fire('Error!', 'Failed to save changes.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setAds(ads.filter((ad) => ad._id !== id));
        Swal.fire("Deleted!", "The advertisement has been deleted.", "success");
      } catch (error) {
        console.error("Delete error", error);
      }
    }
  };

  const handleSaveNewAd = async () => {
    if (!newAdTitle || !newAdImage) {
      Swal.fire("Missing fields", "Title and image are required", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product", newAdImage);

      const uploadRes = await axios.post(UPLOAD_URL, formData);
      const imageUrl = uploadRes.data.image_url;

      const res = await axios.post(API_URL, {
        title: newAdTitle,
        image: imageUrl,
        adminFk: adminId,
      });

      setAds([...ads, res.data.ad]);
      setNewAdTitle("");
      setNewAdImage(null);
      setAdding(false);
      Swal.fire('Added!', 'The advertisement has been added.', 'success');
    } catch (error) {
      console.error("Add error", error);
      Swal.fire('Error!', 'Failed to add the advertisement.', 'error');
    }
  };

  return (
    <div className="advertisement-container">
      <h3 id="page-name">Advertisements</h3>
      <table className="advertisement-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Image</th>
            <th id="action-column" >Action</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad, index) => (
            <tr key={ad._id}>
              <td>{index + 1}</td>
              <td>
                {editingId === ad._id ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  ad.title
                )}
              </td>
              <td>
                {editingId === ad._id ? (
                  <>
                    <input
                      type="file"
                      onChange={(e) => setEditImage(e.target.files[0])}
                    />
                    <img
                      src={ad.image}
                      alt="preview"
                      className="ad-image"
                      style={{ marginTop: "5px" }}
                    />
                  </>
                ) : (
                  <img src={ad.image} alt={ad.title} className="ad-image" />
                )}
              </td>
              <td>
                {editingId === ad._id ? (
                  <>
                    <button className="save-btn" onClick={() => handleUpdate(ad._id)}>
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
                  <button className="edit-btn" onClick={() => handleEdit(ad)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(ad._id)}>
                  Delete
                </button>
                </>
                )}
                
              </td>
            </tr>
          ))}
          {adding && (
            <tr>
              <td>{ads.length + 1}</td>
              <td>
                <input
                  value={newAdTitle}
                  onChange={(e) => setNewAdTitle(e.target.value)}
                  placeholder="Enter title"
                />
              </td>
              <td>
                <input
                  type="file"
                  onChange={(e) => setNewAdImage(e.target.files[0])}
                />
              </td>
              <td>
                <button className="save-btn" onClick={handleSaveNewAd}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setAdding(false);
                    setNewAdTitle("");
                    setNewAdImage(null);
                  }}
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!adding && (
        <button className="add-ad-btn" onClick={() => setAdding(true)}>
          Add Ads
        </button>
      )}
    </div>
  );
};

export default Advertisement;