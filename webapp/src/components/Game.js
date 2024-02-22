// src/components/Game.js
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';

const Game = () => {
  const [questionBody, setQuestionBody] = useState(''); // pregunta aleatoria cuerpo
  const [options, setOptions] = useState([]); // opciones incorrectas y correcta
  const [selectedOption, setSelectedOption] = useState(''); // opción seleccionada por el usuario

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const obtenerPreguntaAleatoria = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/getQuestionBody`);
      setQuestionBody(response.data.questionBody);
      // Obtener opciones incorrectas y la correcta
      const optionsResponse = await axios.get(`${apiEndpoint}/getIncorrectAnswers/${response.data._id}`);
      setOptions([...optionsResponse.data.incorrectAnswers, response.data.typeAnswer]);
    } catch (error) {
      console.error("Error al obtener la pregunta aleatoria", error);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleButtonClick = () => {
    setSelectedOption(''); // Limpiar la opción seleccionada
    obtenerPreguntaAleatoria();
  };

  return (
    <div>
      <h1>Pregunta: </h1>
      <div>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          {questionBody}
        </Typography>
        <div>
          {options.map((option, index) => (
            <Button
              key={index}
              variant="contained"
              color={selectedOption === option ? "primary" : "default"}
              onClick={() => handleOptionClick(option)}
              disabled={selectedOption !== ''}
            >
              {option}
            </Button>
          ))}
        </div>
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Generar pregunta
        </Button>
      </div>
    </div>
  );
}

export default Game;
