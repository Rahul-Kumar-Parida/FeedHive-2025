import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import FeedbackForm from './components/FeedbackForm.jsx';
import AdminLoginForm from './components/AdminLoginForm.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Loading from './components/Loading.jsx';
import Footer from './components/Footer.jsx';
import {
  isAuthenticated,
  getUser,
  isAdminLoggedIn,
  getAdminUser,
  checkTokenValidity
} from './services/auth.js';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check regular user authentication
        if (isAuthenticated()) {
          const currentUser = getUser();
          if (currentUser) {
            setAuthenticated(true);
            setUser(currentUser);
          }
        }

        // Check admin authentication
        if (isAdminLoggedIn()) {
          const currentAdminUser = getAdminUser();
          if (currentAdminUser) {
            setAdminLoggedIn(true);
            setAdminUser(currentAdminUser);
          }
        }
      } catch (error) {
        console.log('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setAuthenticated(true);
    setUser(userData.user);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUser(null);
  };

  const handleAdminLogin = (adminData) => {
    setAdminLoggedIn(true);
    setAdminUser(adminData.user);
  };

  const handleAdminLogout = () => {
    setAdminLoggedIn(false);
    setAdminUser(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar
          authenticated={authenticated}
          user={user}
          onLogout={handleLogout}
          isAdminLoggedIn={adminLoggedIn}
          onAdminLogout={handleAdminLogout}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                authenticated ?
                  <Navigate to="/feedback" /> :
                  <LoginForm onLogin={handleLogin} />
              }
            />
            <Route
              path="/register"
              element={
                authenticated ?
                  <Navigate to="/feedback" /> :
                  <RegisterForm onRegister={handleLogin} />
              }
            />
            <Route
              path="/feedback"
              element={
                authenticated ?
                  <FeedbackForm /> :
                  <Navigate to="/register" />
              }
            />
            <Route
              path="/admin-login"
              element={
                adminLoggedIn ?
                  <Navigate to="/admin-dashboard" /> :
                  <AdminLoginForm onAdminLogin={handleAdminLogin} />
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                adminLoggedIn ?
                  <AdminDashboard onAdminLogout={handleAdminLogout} /> :
                  <Navigate to="/admin-login" />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;