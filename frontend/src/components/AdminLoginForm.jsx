// src/components/AdminLoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/auth';
import '../styles/components.css';

const AdminLoginForm = ({ onAdminLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate admin credentials
      if (formData.email !== 'feedhive@analysis.com' || 
          formData.password !== 'rahulfeedhive@1234') {
        throw new Error('Invalid admin credentials');
      }

      const response = await adminLogin(formData);
      console.log('Admin login successful:', response);
      
      // Call the parent's onAdminLogin function
      if (onAdminLogin) {
        onAdminLogin(response);
      }
      
      // Redirect to admin dashboard
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Admin Login</h2>
        <p className="auth-subtitle">Access admin dashboard</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="feedhive@analysis.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter admin password"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Use admin credentials to access dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;