import React, { useContext, useState } from "react";
import './Navbar.css';
import logo from '../Assets/logo.jpeg';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import { AuthContext } from "../../Context/AuthContext";
import Swal from 'sweetalert2';

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const [showDropdown, setShowDropdown] = useState(false);
    const { getTotalCartItems } = useContext(ShopContext);
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleLogout = () => {
    Swal.fire({
        title: 'Logout Confirmation',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
        logout(); // Use the logout function from AuthContext
        setShowDropdown(false);
        navigate('/');
        
        // Optional: Show success message after logout
        Swal.fire({
            title: 'Logged Out!',
            text: 'You have been successfully logged out.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: true
        });
        }
    });
    };

    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt="" />
                <div className="nav-text">
                    <h1>M SMART GROCERIES</h1>
                    <p>Everything You Need, Right to Your Doorstep</p>
                </div>
            </div>
            <ul className="nav-menu">
                <li onClick={() => { setMenu("shop") }}><Link style={{ textDecoration: 'none' }} to='/'>Shop</Link>{menu === "shop" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("freshAndPantry") }}><Link style={{ textDecoration: 'none' }} to='/freshAndPantry'>Fresh & Pantry Picks</Link>{menu === "freshAndPantry" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("snacksAndBeverage") }}><Link style={{ textDecoration: 'none' }} to='/snacksAndBeverage'>Snacks & Beverage</Link>{menu === "snacksAndBeverage" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("PersonalAndChild") }}><Link style={{ textDecoration: 'none' }} to='/personalAndChild'>Personal & Child Care</Link>{menu === "PersonalAndChild" ? <hr /> : <></>}</li>
                <li onClick={() => { setMenu("household") }}><Link style={{ textDecoration: 'none' }} to='/household'>Household</Link>{menu === "household" ? <hr /> : <></>}</li>
            </ul>
            <div className="nav-login-cart">
                {isAuthenticated ? (
                    <div className="account-dropdown">
                        <button 
                            className="account-button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            {'Account'} {/* Show user's name if available */}
                        </button>
                        {showDropdown && (
                            <div 
                                className="dropdown-content"
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}
                            >
                                <Link to="/profile" onClick={() => setShowDropdown(false)}>Profile</Link>
                                <Link to="/orders" onClick={() => setShowDropdown(false)}>My Orders</Link>
                                <Link onClick={handleLogout}>Logout</Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to='/loginSignup'><button>Login</button></Link>
                )}
                <Link to='/cart'><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    )
}

export default Navbar;