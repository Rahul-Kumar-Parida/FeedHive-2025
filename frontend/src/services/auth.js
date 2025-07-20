const API_BASE_URL = '/api'; // or use import.meta.env.VITE_API_BASE_URL

// User authentication functions
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }
  return await response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }
  const data = await response.json();
  localStorage.setItem('userToken', data.access_token);
  localStorage.setItem('userData', JSON.stringify(data.user));
  return data;
};

export const adminLogin = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Admin login failed');
  }
  const data = await response.json();
  localStorage.setItem('adminToken', data.access_token);
  localStorage.setItem('adminData', JSON.stringify(data.user));
  return data;
};

export const isUserAuthenticated = () => !!localStorage.getItem('userToken');
export const isAdminAuthenticated = () => !!localStorage.getItem('adminToken');
export const isAdminLoggedIn = isAdminAuthenticated;
export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};
export const getCurrentAdmin = () => {
  const adminData = localStorage.getItem('adminData');
  return adminData ? JSON.parse(adminData) : null;
};
export const getAdminUser = getCurrentAdmin;
export const logoutUser = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
};
export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};
export const getAuthToken = () => {
  const userToken = localStorage.getItem('userToken');
  const adminToken = localStorage.getItem('adminToken');
  return userToken || adminToken;
};
export const isAuthenticated = isUserAuthenticated;
export const getUser = getCurrentUser;
export const checkUserFeedbackStatus = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return { hasSubmitted: false, feedbackCount: 0 };
    }
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
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
export const checkTokenValidity = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return { valid: false, user: null };
    }
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const user = await response.json();
      return { valid: true, user };
    } else {
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
export const clearAllAuth = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};
export const isLoggedIn = () => isUserAuthenticated() || isAdminAuthenticated();
export const getCurrentAuthUser = () => getCurrentUser() || getCurrentAdmin(); 