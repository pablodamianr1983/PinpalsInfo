import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Importa los estilos personalizados

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="back-home-link">Go back to Home</Link>
    </div>
  );
};

export default NotFound;
