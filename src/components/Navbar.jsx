import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, userProfile } = useAuth();

  return (
    <nav>
      <div className="left">
        <Link to="/">Home</Link>
        {isAuthenticated && <Link to="/create-article">Crear nuevo artículo</Link>}
      </div>
      <div className="right">
        {isAuthenticated ? (
          <>
            <span>Hola, {userProfile.first_name || 'User'}!</span>
            <Link to="/profile">Perfil</Link>
            <button onClick={logout}>Salir</button>
          </>
        ) : (
          <Link to="/login">Entrar</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
