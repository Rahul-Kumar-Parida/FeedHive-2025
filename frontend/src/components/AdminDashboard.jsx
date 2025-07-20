import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, feedbackAPI } from '../services/api';
import { getAdminUser, logoutAdmin } from '../services/auth';
import '../styles/components.css';

const AdminDashboard = ({ onAdminLogout }) => {
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = getAdminUser();
    if (!admin) {
      navigate('/admin-login');
      return;
    }
    setAdminUser(admin);
    fetchData();
    // eslint-disable-next-line
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, feedbackData] = await Promise.all([
        userAPI.getAllUsers(),
        feedbackAPI.getAllFeedback()
      ]);
      setUsers(usersData);
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    if (onAdminLogout) onAdminLogout();
    navigate('/');
  };

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return 'neutral';
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('positive')) return 'positive';
    if (lowerSentiment.includes('negative')) return 'negative';
    return 'neutral';
  };

  const getSentimentIcon = (sentiment) => {
    if (!sentiment) return '😐';
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('positive')) return '😊';
    if (lowerSentiment.includes('negative')) return '😞';
    return '😐';
  };

  // Sentiment summary for company
  const sentimentSummary = feedback.reduce(
    (acc, item) => {
      if (!item.sentiment) acc.neutral += 1;
      else if (item.sentiment.toLowerCase().includes('positive')) acc.positive += 1;
      else if (item.sentiment.toLowerCase().includes('negative')) acc.negative += 1;
      else acc.neutral += 1;
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-info">
          <h1>FeedHive Admin Dashboard</h1>
          <p>Welcome, {adminUser?.full_name} ({adminUser?.email})</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Sentiment Summary */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Feedback</h3>
          <p className="stat-number">{feedback.length}</p>
        </div>
        <div className="stat-card">
          <h3>Positive Feedback</h3>
          <p className="stat-number positive">{sentimentSummary.positive}</p>
        </div>
        <div className="stat-card">
          <h3>Negative Feedback</h3>
          <p className="stat-number negative">{sentimentSummary.negative}</p>
        </div>
        <div className="stat-card">
          <h3>Neutral Feedback</h3>
          <p className="stat-number neutral">{sentimentSummary.neutral}</p>
        </div>
        <div className="stat-card">
          <h3>Authenticated Feedback</h3>
          <p className="stat-number">{feedback.filter(f => f.user_id).length}</p>
        </div>
        <div className="stat-card">
          <h3>Anonymous Feedback</h3>
          <p className="stat-number">{feedback.filter(f => !f.user_id).length}</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          Feedback ({feedback.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'users' && (
          <div className="users-section">
            <h2>All Users</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined Date</th>
                    <th>Feedback Count</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>{feedback.filter(f => f.user_id === user.id).length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-section">
            <h2>All Feedback</h2>
            <div className="feedback-grid">
              {feedback.map(item => (
                <div key={item.id} className="feedback-card">
                  <div className="feedback-header">
                    <span className="feedback-id">#{item.id}</span>
                    <span className={`sentiment-badge ${getSentimentColor(item.sentiment)}`}>
                      {getSentimentIcon(item.sentiment)} {item.sentiment || 'Neutral'}
                    </span>
                  </div>
                  <div className="feedback-content">
                    <p><strong>Title:</strong> {item.title}</p>
                    <p><strong>Content:</strong> {item.content}</p>
                    <p><strong>User:</strong> {item.user_id ? `User #${item.user_id}` : 'Anonymous'}</p>
                    <p><strong>Date:</strong> {new Date(item.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;