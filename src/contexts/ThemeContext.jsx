import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto de tema
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isLightMode, setIsLightMode] = useState(false);

  // Establece el tema inicial según la preferencia guardada
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    setIsLightMode(prevMode => {
      const newMode = !prevMode;

      if (newMode) {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      }

      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
