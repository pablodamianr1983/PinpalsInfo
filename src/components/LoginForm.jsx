import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LoginForm.css'; 
import logo from '../assets/pinpals-logo.png';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, authError, authSuccess } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password, rememberMe); 
    if (!authError) {
      navigate('/');
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-wrapper">
        <div className="login-logo-container">
          <Link to="/">
            <img src={logo} alt="Logo" className="login-logo" />
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                id="username"
                name="username"
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faUser} />
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                id="password"
                name="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faLock} />
              </span>
            </p>
          </div>
          <div className="login-checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Guardar usuario
            </label>
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-success is-dark" type="submit">
                Iniciar sesión
              </button>
            </p>
          </div>
        </form>
        {authError && (
          <div className="auth-message-container">
            <div className="auth-message" style={{ color: 'red' }}>{authError}</div>
          </div>
        )}
        {authSuccess && (
          <div className="auth-message-container">
            <div className="auth-message" style={{ color: 'green' }}>{authSuccess}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
