import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const ThemeColor = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  // Establece el tema oscuro por defecto
  useEffect(() => {
    document.documentElement.classList.add('dark-theme');
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('light-theme');
    setIsLightMode(!isLightMode);
  };

  return (
    <button onClick={toggleTheme} className="button is-warning is-dark">
      <span className="icon">
        <FontAwesomeIcon icon={isLightMode ? faMoon : faSun} />
      </span>
    </button>
  );
};

export default ThemeColor;

