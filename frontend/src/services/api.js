// src/services/api.js

const API_BASE_URL = '/api';  // This will proxy to your Render backend;

// Get auth token
const getAuthToken = () => {
  const userToken = localStorage.getItem('userToken');
  const adminToken = localStorage.getItem('adminToken');
  return userToken || adminToken;
};

// Feedback API functions
export const feedbackAPI = {
  // Submit feedback (authenticated user)
  submitFeedback: async (feedbackData) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Please login to submit feedback');
    }

    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: feedbackData.content,
        category: 'general', // Default category
        rating: 5 // Default rating
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to submit feedback');
    }

    return response.json();
  },

  // Submit anonymous feedback
  submitAnonymousFeedback: async (feedbackData) => {
    const response = await fetch(`${API_BASE_URL}/api/feedback/anonymous`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: feedbackData.content,
        category: 'general',
        rating: 5
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to submit anonymous feedback');
    }

    return response.json();
  },

  // Get all feedback (admin only)
  getAllFeedback: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch feedback');
    }

    return response.json();
  }
};

// User API functions
export const userAPI = {
  // Register user
  registerUser: async (userData) => {
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

    return response.json();
  },

  // Login user
  loginUser: async (credentials) => {
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

    return response.json();
  },

  // Admin login
  adminLogin: async (credentials) => {
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

    return response.json();
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch users');
    }

    return response.json();
  }
};