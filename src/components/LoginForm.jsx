import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LoginForm.css'; 
import logo from '../assets/pinpals-logo.png';  
import homerImage from '../assets/homer1.png';
import homer2Image from '../assets/homer2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

// Componente Modal
const Modal = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose} className="button is-danger is-dark">Cerrar</button>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(homerImage); 
  const [showModal, setShowModal] = useState(false); // Estado que controla el modal
  const [errorMessage, setErrorMessage] = useState(''); // Estado que controla el mensaje de error personalizado
  const { login, authError } = useAuth(); 
  const navigate = useNavigate();

  const handlePasswordFocus = () => {
    setBackgroundImage(homer2Image);
  };

  const handlePasswordBlur = () => {
    setBackgroundImage(homerImage);
  };

  // Función para mensaje de error
  const getErrorMessage = (error) => {
    if (error.includes('wrong password')) {
      return 'La contraseña que ingresaste es incorrecta. Por favor, inténtalo de nuevo.';
    } else if (error.includes('user not found')) {
      return 'El usuario no existe. Verifica tu nombre de usuario.';
    } else {
      return 'Ups, al parecer tus datos son incorrectos.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password, rememberMe); 
    if (authError) {
      setErrorMessage(getErrorMessage(authError)); // Establece el mensaje personalizado
      setShowModal(true); // Muestra el modal si hay un error
    } else if (success) {
      navigate("/", { replace: true }); // Redirige al home solo si el login fue exitoso
    }
  };

  return (
    <div 
      className="login-form-container" 
      style={{ backgroundImage: `url(${backgroundImage})` }} 
    >
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
                onFocus={handlePasswordFocus}  
                onBlur={handlePasswordBlur}    
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
        <Modal 
          show={showModal} 
          onClose={() => setShowModal(false)} 
          message={errorMessage} // Usa el mensaje de error personalizado
        />
      </div>
    </div>
  );
};

export default LoginForm;
