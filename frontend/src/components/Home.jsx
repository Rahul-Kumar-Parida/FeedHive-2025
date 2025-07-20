import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">Welcome to FeedHive</h1>
                <p className="home-subtitle">
                    Your feedback matters! Share your thoughts, suggestions, and experiences with us.
                    We're committed to improving our services based on your valuable input.
                </p>

                <div className="home-buttons">
                    <Link to="/register" className="btn btn-primary">
                        Feedback Submit
                    </Link>
                    <Link to="/login" className="btn btn-secondary">
                        Login
                    </Link>
                </div>

                <div className="features-section">
                    <h2>How It Works</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📝</div>
                            <h3>1. Register</h3>
                            <p>Create your account to start sharing feedback with us.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔐</div>
                            <h3>2. Login</h3>
                            <p>Sign in with your email and password to access your account.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💬</div>
                            <h3>3. Submit Feedback</h3>
                            <p>Share your thoughts, suggestions, or concerns about our services.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>4. Track Progress</h3>
                            <p>We analyze your feedback to continuously improve our services.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home;