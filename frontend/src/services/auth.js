// src/services/auth.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// User authentication functions
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    
    // Store user token
    localStorage.setItem('userToken', data.access_token);
    localStorage.setItem('userData', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Admin authentication functions
export const adminLogin = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Admin login failed');
    }

    const data = await response.json();
    
    // Store admin token separately
    localStorage.setItem('adminToken', data.access_token);
    localStorage.setItem('adminData', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isUserAuthenticated = () => {
  const token = localStorage.getItem('userToken');
  return !!token;
};

// Check if admin is authenticated
export const isAdminAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

// Check if admin is logged in (alias for isAdminAuthenticated)
export const isAdminLoggedIn = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

// Get current user data
export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Get current admin data
export const getCurrentAdmin = () => {
  const adminData = localStorage.getItem('adminData');
  return adminData ? JSON.parse(adminData) : null;
};

// Get admin user (alias for getCurrentAdmin)
export const getAdminUser = () => {
  const adminData = localStorage.getItem('adminData');
  return adminData ? JSON.parse(adminData) : null;
};

// Logout functions
export const logoutUser = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};

// Get appropriate token for API calls
export const getAuthToken = () => {
  const userToken = localStorage.getItem('userToken');
  const adminToken = localStorage.getItem('adminToken');
  return userToken || adminToken;
};

// Alias functions for your components
export const isAuthenticated = isUserAuthenticated;
export const getUser = getCurrentUser;

// Check user feedback status
export const checkUserFeedbackStatus = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return { hasSubmitted: false, feedbackCount: 0 };
    }

    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const feedback = await response.json();
      return {
        hasSubmitted: feedback.length > 0,
        feedbackCount: feedback.length
      };
    } else {
      return { hasSubmitted: false, feedbackCount: 0 };
    }
  } catch (error) {
    console.error('Error checking feedback status:', error);
    return { hasSubmitted: false, feedbackCount: 0 };
  }
};

// Check token validity
export const checkTokenValidity = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return { valid: false, user: null };
    }

    const response = await fetch(`${API_BASE_URL}/api/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const user = await response.json();
      return { valid: true, user };
    } else {
      // Token is invalid, clear it
      logoutUser();
      logoutAdmin();
      return { valid: false, user: null };
    }
  } catch (error) {
    console.error('Error checking token validity:', error);
    logoutUser();
    logoutAdmin();
    return { valid: false, user: null };
  }
};

// Additional utility functions that might be needed
export const clearAllAuth = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};

export const isLoggedIn = () => {
  return isUserAuthenticated() || isAdminAuthenticated();
};

export const getCurrentAuthUser = () => {
  const user = getCurrentUser();
  const admin = getCurrentAdmin();
  return user || admin;
};