import React from 'react';
import { Helmet } from 'react-helmet-async';
import LoginForm from '../components/LoginForm';
import './Login.css';

const Login = () => {
  return (
    <>
      <Helmet>
        <title>PinPals | Login</title>
      </Helmet>
      
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

