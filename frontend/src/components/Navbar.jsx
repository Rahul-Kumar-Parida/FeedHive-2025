// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser, logoutAdmin } from '../services/auth';
import '../styles/components.css';

const Navbar = ({ authenticated, user, onLogout, isAdminLoggedIn, onAdminLogout }) => {
  const navigate = useNavigate();

  const handleUserLogout = () => {
    logoutUser();
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    if (onAdminLogout) {
      onAdminLogout();
    }
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          FeedHive
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          
          {!authenticated && !isAdminLoggedIn && (
            <>
              <Link to="/register" className="nav-link">
                Register
              </Link>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/admin-login" className="nav-link admin-link">
                Admin Login
              </Link>
            </>
          )}
          
          {authenticated && (
            <>
              <Link to="/feedback" className="nav-link">
                Submit Feedback
              </Link>
              <span className="nav-user">
                Welcome, {user?.full_name}
              </span>
              <button onClick={handleUserLogout} className="nav-logout">
                Logout
              </button>
            </>
          )}
          
          {isAdminLoggedIn && (
            <>
              <Link to="/admin-dashboard" className="nav-link">
                Admin Dashboard
              </Link>
              <span className="nav-user">
                Admin: {user?.full_name}
              </span>
              <button onClick={handleAdminLogout} className="nav-logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;