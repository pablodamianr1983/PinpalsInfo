import React, { useState } from 'react';
import './ChatBot.css';

const phrases = [
    "¡Ay caramba!",
    "Excelente...",
    "¡D'oh!",
    "Estúpido y sensual Flanders.",
    "¡Me fallaste, cerebro!",
    "¡Multiplícate por cero!",
    "¡Mmm... rosquillas!",
    "La culpa es mía, y la responsabilidad de los demás.",
    "No estoy gordo, solo estoy llenito de amor.",
    "¿Cómo se supone que la educación me hará más listo? ¡Toda mi vida me han mentido! ¡Yo quiero mi dinero de vuelta!",
    "Para mentir se necesitan dos, uno que mienta y otro que crea.",
    "Operadora, deme el número para el 911.",
    "Lisa, los vampiros son seres imaginarios, como los duendes, los gremlins y los esquimales.",
    "¡Marge, no voy a mentirte!",
    "Siempre he confiado en la bondad de las personas.",
    "No soy una persona que se impresione fácilmente... ¡Mira, un coche azul!",
    "Yo no estaba mintiendo, estaba escribiendo ficción con la boca.",
    "¡Yo no fui!",
    "No hay problema que el alcohol no pueda resolver... ¡excepto los problemas causados por el alcohol!",
    "Soy como ese tipo que siempre está contento... ¿Cómo se llama? Ah, sí, ¡Homero Simpson!",
    "¡Si algo es difícil de hacer, entonces no vale la pena hacerlo!",
    "¡Quiero cerveza, quiero una mujerzuela, quiero todo el mundo!",
    "¡Soy tan inteligente, S-M-R-T, quiero decir, S-M-A-R-T!",
    "¡Yo no estoy sobrio, estoy sobrio de la misma manera que tú lo estás, pero al revés!",
    "¡Me voy a la taberna de Moe para pensar, reflexionar y olvidarme de todo!",
    "¡Es mejor ver cosas que hacer cosas!",
    "¡Me siento como un niño envuelto en un dulce gigante!",
    "¡Marge, ya he aprendido a no intentarlo!",
    "¡Nunca voy a dejar de hacer lo que hago, excepto cuando sí lo hago!",
    "¡Ya estaba así cuando llegué!",
    "¡Sigue así, muchacho!",
    "Tengo tres consejos para el trabajo: 1. Haz el trabajo bien. 2. Hazlo rápido. 3. Mantén al jefe feliz.",
    "¡No vives de ensalada!",
    "¡Ooooh, Moe, ooooh... Estoy buscando mi piso!",
    "Marge, creo que odio a Michael Jackson.",
    "¡Me conformo con saber que, en su momento, estuve muy cerca de ella!",
    "A la grande le puse Cuca",
    "Continua así muchacho",
    "Sigue haciendo clic"
  ];
  
  

const ChatBot = () => {
  const [clickCount, setClickCount] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState('¡Hola!');

  const handleClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount < phrases.length) {
      setCurrentPhrase(phrases[newClickCount]);
    } else {
      setCurrentPhrase("¡Eres un clic maníaco!");
      setClickCount(0); // Resetea para volver a empezar
    }
  };

  return (
    <div className="chat-bot" onClick={handleClick}>
      <img src="/homero.png" alt="Chat Bot" />
      <div className="chat-bot-message">{currentPhrase}</div>
    </div>
  );
};

export default ChatBot;
