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
          Somos dos amigos y compañero de la carrera apasionados por la tecnología y la innovación, siempre en busca de crear 
          cosas geniales que sean útiles y accesibles para todos y todas. Nuestra meta es poder desarrollar aplicaciones que 
          te faciliten la vida, que sean intuitivas y estén al alcance de cualquiera.
        </p>
        <p className="highlight-text">
        Crecimos viendo Los Simpson, así que somos fanáticos de corazón. Esta serie nos ha acompañado desde 
        que éramos chicos hasta la adultez, haciéndonos reír, pensar y enseñándonos valiosas lecciones de vida. 
        Por eso, siempre encontrarás un toque de ese humor y filosofía en todo lo que hacemos.
        </p>
      </div>
      
      <div className="link-section">
        <Link to="/" className="button is-link is-dark">Volver al inicio</Link>
      </div>
    </>
  );
};

export default AboutUs;
