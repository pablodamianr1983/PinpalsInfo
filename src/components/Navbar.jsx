import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeColor from './ThemeColor';
import logo from '../assets/pinpals-logo.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout, userProfile } = useAuth();
  const [isActive, setIsActive] = useState(false);

  const toggleBurgerMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="navbar is-warning" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <button
          className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={toggleBurgerMenu}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <Link to="/" className="navbar-item">
            Home
          </Link>
          <Link to="/" className="navbar-item">
            Quienes Somos
          </Link>
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
            <ThemeColor />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
