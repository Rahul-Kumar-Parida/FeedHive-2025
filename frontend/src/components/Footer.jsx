import React from 'react';
import '../styles/components.css';

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            &copy; {new Date().getFullYear()} FeedHive | Powered by Your Company Name
        </div>
    </footer>
);

export default Footer;