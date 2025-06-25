import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import './CSS/Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        mobileNo: user.mobileNo || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:4000/customers/${user._id}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.data.success) {
        // Update local storage with new data
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        await Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          showConfirmButton: false,
          timer: 1500
        });
        
        setIsEditing(false);
        window.location.reload(); // Refresh to update context
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'Failed to update profile',
        confirmButtonColor: '#673B11'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#673B11',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await axios.delete(
          `http://localhost:4000/customers/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        
        logout();
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your account has been deleted.',
          icon: 'success',
          confirmButtonColor: '#673B11'
        });
        navigate('/');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: error.response?.data?.message || 'Failed to delete account',
          confirmButtonColor: '#673B11'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) {
    return (
        <div className="profile-background">
            <div className="profile-container">
                <h2>Please login to view your profile</h2>
                <button onClick={() => navigate('/loginSignup')} className="login-redirect-btn">
                Go to Login
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="profile-background">
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdateProfile} className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              required
              disabled // Typically shouldn't allow email changes
            />
          </div>
          
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobileNo"
              value={profileData.mobileNo}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Mobile:</span>
            <span className="info-value">{user.mobileNo || 'Not provided'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Address:</span>
            <span className="info-value">{user.address || 'Not provided'}</span>
          </div>
        </div>
      )}

      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <button onClick={handleDeleteAccount} className="delete-account-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Delete My Account'}
        </button>
      </div>
    </div>
    </div>
  );
};

export default Profile;