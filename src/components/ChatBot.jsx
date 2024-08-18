import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = ({ articles }) => {
  const [currentPhrase, setCurrentPhrase] = useState('¡Hola! Hazme una pregunta sobre los artículos.');
  const [inputValue, setInputValue] = useState('');

  const handleQuestion = () => {
    const question = inputValue.toLowerCase();
    let response = "Lo siento, no tengo una respuesta para eso.";

    articles.forEach((article) => {
      if (article.content && article.content.toLowerCase().includes(question)) {
        response = `Aquí tienes información de uno de los artículos que encontré: ${article.title} - ${article.abstract}`;
      }
    });

    setCurrentPhrase(response);
    setInputValue(''); // Limpia el campo de entrada
  };

  return (
    <div className="chat-bot">
      <img src="/homero.png" alt="Chat Bot" onClick={() => setCurrentPhrase("Hazme una pregunta sobre los artículos.")} />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Hazme una pregunta"
      />
      <button onClick={handleQuestion}>Preguntar</button>
      <div className="chat-bot-message">{currentPhrase}</div>
    </div>
  );
};

export default ChatBot;
