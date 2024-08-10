import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <>
      <div className="title-section">
        <h1>404 - Page Not Found</h1>
      </div>
      
      <div className="message-section">
        <p>The page you are looking for does not exist.</p>
      </div>
      
      <div className="link-section">
        <Link to="/" className="back-home-link">Go back to Home</Link>
      </div>
    </>
  );
};

export default NotFound;
