import React from 'react';
import 'bulma/css/bulma.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '../styles/Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer custom-footer">
      <div className="content has-text-centered has-text-white">
        <p>
            <strong className="has-text-warning">Info PinPals 2024</strong> by Lucas & Pablo
            <a href="#" className="has-text-white"> | Programación 3</a>
        </p>

        <p>
          <a href="https://github.com/pablodamianr1983/pinpalsinfo.git" className="has-text-white">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="https://instagram.com" className="has-text-white" style={{ marginLeft: '10px' }}>
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;