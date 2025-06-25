import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import Swal from 'sweetalert2';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    mobileNo: '',
    address: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const url = isLogin 
        ? 'http://localhost:4000/customers/login' 
        : 'http://localhost:4000/customers/signup';
      
      const requestData = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;
  
      const response = await axios.post(url, requestData);
  
      if (response.data.success) {
        if (isLogin) {
          // Handle login success
          login(response.data.token, response.data.customer); // Use AuthContext login
          
          await Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
          });
          
          navigate('/');
        } else {
          // Handle registration success
          await Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'Please login with your new account',
            confirmButtonColor: '#673B11',
          });
          
          setIsLogin(true); // Switch to login form
          // Clear form except email (for convenience)
          setFormData(prev => ({
            ...prev,
            name: '',
            mobileNo: '',
            address: '',
            password: ''
          }));
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         (isLogin ? 'Login failed' : 'Registration failed');
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
        confirmButtonColor: '#673B11',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='loginsignup'>
      <div className={`loginsignup-container ${isLogin ? 'login-mode' : 'register-mode'}`}>
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="loginsignup-fields">
            {!isLogin && (
              <>
                <input 
                  type="text" 
                  name="name"
                  placeholder='Name' 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="text" 
                  name="mobileNo"
                  placeholder='Mobile Number' 
                  value={formData.mobileNo}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="text" 
                  name="address"
                  placeholder='Address' 
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            <input 
              type="email" 
              name="email"
              placeholder='Email Address' 
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input 
              type="password" 
              name="password"
              placeholder='Password' 
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? (
              <span className="button-loader"></span>
            ) : isLogin ? 'Login' : 'Register'}
          </button>
          <p className="loginsignup-login">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={toggleForm}>
              {isLogin ? 'Register' : 'Login'}
            </span>
          </p>
          {!isLogin && (
            <div className="loginsignup-agree">
              <input type='checkbox' name='agree' id='agree' required/>
              <p>I agree to the terms of <span>use & privacy policy</span></p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;