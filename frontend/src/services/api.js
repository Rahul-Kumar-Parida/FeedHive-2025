const API_BASE_URL = '/api'; // or use import.meta.env.VITE_API_BASE_URL

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
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(feedbackData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to submit feedback');
    }
    return await response.json();
  },

  // Submit anonymous feedback
  submitAnonymousFeedback: async (feedbackData) => {
    const response = await fetch(`${API_BASE_URL}/feedback/anonymous`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to submit feedback');
    }
    return await response.json();
  },

  // Get all feedback (admin only)
  getAllFeedback: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch feedback');
    }
    return await response.json();
  },

  // Get feedback stats (admin only)
  getFeedbackStats: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    const response = await fetch(`${API_BASE_URL}/feedback/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch feedback stats');
    }
    return await response.json();
  }
};

// User API functions
export const userAPI = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch users');
    }
    return await response.json();
  },

  // Get current user info
  getCurrentUser: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch user info');
    }
    return await response.json();
  }
};

// General API utility functions
export const apiUtils = {
  // Test API connection
  testConnection: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('API connection failed');
    }
    return await response.json();
  },

  // Get API status
  getStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
      throw new Error('API status check failed');
    }
    return await response.json();
  }
};
