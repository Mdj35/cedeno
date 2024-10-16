import React from 'react';
import { Link } from 'react-router-dom';
import classes from './header.module.css';
import { useCart } from '../../hooks/useCart';

export default function Header() {
  const user = localStorage.getItem('user'); // Retrieve username from localStorage
  const token = localStorage.getItem('token'); // Retrieve token to check if logged in
  const { cart } = useCart();

  const logout = () => {
    localStorage.removeItem('token'); // Clear token
    localStorage.removeItem('user');  // Clear username
    window.location.reload(); // Reload the page to reflect logout
  };

  const isAdmin = token && token.includes("admin"); // Assuming token contains "admin" if admin

  // Assuming you have a dynamic profile image URL in localStorage (if available)
  const profilePicUrl = 'frontEnd/public/pfp.jpg'; // Use a dynamic user profile image URL if available

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <Link to="/" className={classes.logo}>PZAM Cups Printing Davao!</Link>
        <nav>
          <ul>
            {user ? (
              <li className={classes.menu_container}>
                {/* Display logged-in username and profile picture */}
                <span className={classes.profile_info}>
                  <img src={profilePicUrl} alt="Profile" className={classes.profile_pic} />
                  <span>{user}</span> {/* Show logged-in username */}
                </span>
                <div className={classes.menu}>
                  <Link to="/profile">Profile</Link> {/* Profile link */}
                  <Link to="/orders">Orders</Link> {/* Orders link */}
                  <a onClick={logout}>Logout</a> {/* Logout link */}
                </div>
              </li>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
            <li>
              <Link to="/cart">
                Cart
                {cart.totalCount > 0 && <span className={classes.cart_count}>{cart.totalCount}</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
