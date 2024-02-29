// src/components/Game.js
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';

const Game = () => {
  const [question, setQuestion] = useState({ body: '', options: [] });
  const [selectedOption, setSelectedOption] = useState('');

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const obtenerPreguntaAleatoria = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/getQuestion`);
      setQuestion({
        body: response.data.questionBody,
        options: [...response.data.incorrectAnswers, response.data.typeAnswer],
      });
    } catch (error) {
      console.error("Error al obtener la pregunta aleatoria", error);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleButtonClick = () => {
    setSelectedOption('');
    obtenerPreguntaAleatoria();
  };

  return (
    <div>
      <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
        Pregunta:
      </Typography>
      <div>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          {question.body}
        </Typography>
        <div>
          {question.options.map((option, index) => (
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

