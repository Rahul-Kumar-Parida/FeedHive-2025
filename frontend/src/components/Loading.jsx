import React from 'react';
import '../styles/components.css';

const Loading = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <span className="loading-text">Loading...</span>
  </div>
);

export default Loading;