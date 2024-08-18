import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = ({ articles }) => {
  const [currentPhrase, setCurrentPhrase] = useState('¡Hola! Hazme una pregunta sobre los artículos.');
  const [inputValue, setInputValue] = useState('');

  const predefinedResponses = {
    'hola': 'Hola, ¿cómo estás?',
    'doh': '¡D\'oh!',
    'cerebro': '¿Qué quieres de mí ahora, cerebro?',
    'excelente': 'Eeeexcelente...',
    'aburrido': '¡Aburrido! ¡Aburrido!',
    'homero': '¡Me llamo Homero, no \'Homero J.\'!',
    'ay caramba': '¡Ay caramba!',
    'lisa': 'Si alguien me necesita, estaré en mi habitación.',
    'marge': '¡Homero!',
    'bart': '¡No tengo vaca, no tengo toro, no tengo escuela!',
    'maggie': '*chupones*',
    'apu': '¡Gracias, vuelva pronto!',
    'moe': 'Si alguien llama diciendo “Seymour Butts” no estoy.',
    'nelson': '¡Ha-Ha!',
    'flanders': '¡Hola, vecinillo!',
    'diamante': '¡Voten por mí!',
    'krusty': 'Hey Hey! ¡Es el show de Krusty!',
    'burns': 'Liberen a los perros.',
    'smithers': 'Lo que usted diga, señor Burns.',
    'willy': '¡No toques a Willy!',
    'skinner': '¡Patrulla escolar, al ataque!',
    'superintendente': '¡Skinner!',
    'lenny': 'No sé quién eres, pero estoy casado.',
    'carl': 'Esta es una situación loca, loco.',
    'barney': '¡Oh, mi vida ha sido un torbellino de emociones!',
    'milhouse': '¡Todo está saliendo Milhouse!',
    'otto': 'Sigue rockeando, hombre.',
    'ralph': 'Mi gato huele a gasolina.',
    'moleman': '¡Estoy bien!',
    'patty': '¿Otra vez ese idiota de Homero?',
    'selma': 'Marge, tienes que dejar a ese hombre.',
    'troy': 'Hola, soy Troy McClure, tal vez me recuerden de...',
    'gil': 'Vamos, Gil necesita un descanso.',
    'wiggum': '¿Qué estás mirando? ¡Sigue adelante!',
    'ralph': '¡Yo choqué el auto de la escuela!',
    'jimbo': 'Tú sí que sabes hacer travesuras.',
    'agnes': '¡Seymour, el aliento de la muerte se acerca!',
    'reverendo': 'Hermanos y hermanas, vamos a rezar.',
    'snake': 'Oh no, hombre, no de nuevo.',
    'duffman': '¡Oh yeah!',
    'kent': 'Y así son las noticias...',
    'bob': 'Te odio, Bart Simpson.',
    'apu nahasapeemapetilon': 'Bienvenido, venga otra vez.',
    'disco stu': 'Disco Stu no anuncia con descuentos.',
    'professor frink': '¡Glavin!',
    'grampa': '¡Estoy lleno de recuerdos y tengo frío!',
    'herbert': 'Me pregunto cómo sería la vida si Homero no fuera mi hermano.',
    'mindy': 'No puedo competir con su esposa, Homero.',
    'sherri y terri': '¡No te sientas mal, Bart!',
    'kodos': '¡Llévenme ante su líder!',
    'kang': '¡Estamos aquí para conquistar su planeta!',
  };

  const handleQuestion = () => {
    const question = inputValue.toLowerCase();
    let response = "Lo siento, no tengo una respuesta para eso.";

    // Verificar si la pregunta coincide con alguna respuesta predefinida
    if (predefinedResponses[question]) {
      response = predefinedResponses[question];
    } else {
      // Buscar en los artículos
      articles.forEach((article) => {
        if (article.content && article.content.toLowerCase().includes(question)) {
          response = `Aquí tienes información de uno de los artículos que encontré: ${article.title} - ${article.abstract}`;
        }
      });
    }

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
