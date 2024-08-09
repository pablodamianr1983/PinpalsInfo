import React from 'react';
import LoginForm from '../components/LoginForm';
import './Login.css'; // Importa los estilos personalizados

const Login = () => {
  return (
    <div className="container">
      <h2>Login</h2>
      <LoginForm />
    </div>
  );
};

export default Login;
