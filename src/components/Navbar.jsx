import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/pinpals-logo.png';
import '../App.css';

const Navbar = () => {
  const { isAuthenticated, logout, userProfile } = useAuth();
  const [isLightMode, setIsLightMode] = useState(false);

  // Tema oscuro por defecto
  useEffect(() => {
    document.documentElement.classList.add('dark-theme');
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('light-theme');
    setIsLightMode(!isLightMode);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar is-warning">
        <Link to="/" className="navbar-item">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <Link to="/" className="navbar-item">
          Home 
        </Link>
        <Link to="/" className="navbar-item">
          Quienes Somos 
        </Link>
        <div className="navbar-burger burger" data-target="navbarBasicExample">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar is-warning">
          {isAuthenticated && (
            <Link to="/create-article" className="navbar-item">
              Crear entrada
            </Link>
          )}
        </div>

        <div className="navbar-end">
          {isAuthenticated ? (
            <>
              <div className="navbar-item">
                <span>Hola, {userProfile.first_name || 'User'}!</span>
              </div>
              <div className="navbar-item">
                <Link to="/profile" className="button is-link is-dark">
                  Perfil
                </Link>
              </div>
              <div className="navbar-item">
                <button onClick={logout} className="button is-danger is-dark">
                  Salir
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-item">
              <Link to="/login" className="button is-success is-dark">
                Entrar
              </Link>
            </div>
          )}
          <div className="navbar-item">
            <button onClick={toggleTheme} className="button is-warning is-dark">
              <span className="icon">
                <FontAwesomeIcon icon={isLightMode ? faMoon : faSun} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

