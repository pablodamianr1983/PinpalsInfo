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
      <div className="form-section">
        <LoginForm />
      </div>
    </>
  );
};

export default Login;

