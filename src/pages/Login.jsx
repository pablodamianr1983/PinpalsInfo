import React from 'react';
import LoginForm from '../components/LoginForm';
import './Login.css';

const Login = () => {
  return (
    <>
      <div className="title-section">
        <h2></h2>
      </div>
      
      <div className="form-section">
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
