import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './AboutUs.css';


const AboutUs = () => {
  return (
    <>

      <Helmet>
        <title>Quienes somos | PinPals</title>
      </Helmet>
      <div className="title-section">
        <h1>¿Quiénes Somos?</h1>
      </div>
      
      <div className="message-section">
        <p className="highlight-text">
          Somos un grupo de pibes apasionados por la tecnología y la innovación, siempre buscando 
          hacer cosas piolas que sean útiles y accesibles para todos. Nuestra misión es crear 
          aplicaciones que te faciliten la vida, que sean intuitivas y estén al alcance de cualquiera.
        </p>
        <p className="highlight-text">
          Nos criamos viendo Los Simpson, así que somos re fanáticos. Esa serie nos marcó desde que 
          éramos pendejos hasta la adultez. Nos hizo reír, pensar y hasta nos enseñó cosas de la vida. 
          Por eso, siempre hay un toque de ese humor y filosofía en todo lo que hacemos.
        </p>
        <p className="highlight-text">
          Con años de experiencia en el desarrollo web, nos especializamos en armar aplicaciones bien 
          robustas usando lo último en tecnología: React, Node.js, y bases de datos modernas, todo bien al día.
        </p>
      </div>
      
      <div className="link-section">
        <Link to="/" className="back-home-link">Volver al inicio</Link>
      </div>
    </>
  );
};

export default AboutUs;
