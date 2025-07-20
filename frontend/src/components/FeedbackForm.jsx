// src/components/FeedbackForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedbackAPI } from '../services/api.js';
import { validateTitle, validateContent } from '../utils/validation.js';
import { getUser, isAuthenticated } from '../services/auth.js';
import '../styles/components.css';

const FeedbackForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [isFormEnabled, setIsFormEnabled] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            // Show form but disable submit button
            setIsFormEnabled(false);
            setMessage('Please register and login to submit feedback.');
        } else {
            const currentUser = getUser();
            setUser(currentUser);
            setIsFormEnabled(true);
            setMessage('');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        const titleError = validateTitle(formData.title);
        if (titleError) newErrors.title = titleError;

        const contentError = validateContent(formData.content);
        if (contentError) newErrors.content = contentError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If not authenticated, redirect to register
        if (!isAuthenticated()) {
            navigate('/register');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await feedbackAPI.submitFeedback(formData);
            setMessage('Feedback submitted successfully! Thank you for your contribution.');
            setFormData({ title: '', content: '' });

            // Redirect to home after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            if (error.message === 'Please login to submit feedback') {
                navigate('/login');
                return;
            }
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feedback-form-container">
            <div className="form-card">
                <h2 className="form-title">Submit Feedback</h2>

                {!isAuthenticated() ? (
                    <div className="auth-notice">
                        <p>Please register and login to submit feedback.</p>
                        <div className="auth-buttons">
                            <button
                                onClick={() => navigate('/register')}
                                className="btn btn-primary"
                            >
                                Register
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn btn-secondary"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="user-info">Welcome, {user?.full_name}!</p>
                )}

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`form-input ${errors.title ? 'error' : ''}`}
                            placeholder="Enter feedback title"
                            required
                        />
                        {errors.title && <span className="error-text">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Feedback Content *</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className={`form-input ${errors.content ? 'error' : ''}`}
                            placeholder="Share your feedback..."
                            rows="6"
                            required
                        />
                        {errors.content && <span className="error-text">{errors.content}</span>}
                    </div>

                    <button
                        type="submit"
                        className={`submit-btn ${!isFormEnabled ? 'disabled' : ''}`}
                        disabled={loading || !isFormEnabled}
                    >
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;