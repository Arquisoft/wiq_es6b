import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Snackbar } from '@mui/material';

const Game = ({ username }) => {
  const [question, setQuestion] = useState({});
  const [error, setError] = useState('');
  const [correctQuestions,setCorrectQuestions] = useState(0);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    obtenerPreguntaAleatoria();
  }, []);

  const obtenerPreguntaAleatoria = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/getRandomQuestionTest`);
      setQuestion(response.data);
    } catch (error) {
      console.error("Error al obtener la pregunta aleatoria", error);
      setError('Error al obtener la pregunta aleatoria');
    }
  };

  const handleButtonClick = (esCorrecta) => {
    if (esCorrecta) {
      setCorrectQuestions(correctQuestions+1);
    } 
    obtenerPreguntaAleatoria();
  };

  return (
    <Container maxWidth="lg">
      <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
        {question.questionBody}
      </Typography>
      {question.incorrectas && question.correcta && (
        <>
          {[...question.incorrectas, question.correcta].sort(() => Math.random() - 0.5).map((respuesta, index) => (
            <Button
              key={index}
              variant="contained"
              color="primary"
              onClick={() => handleButtonClick(respuesta === question.correcta)}
            >
              {respuesta}
            </Button>
          ))}
        </>
      )}
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}
    </Container>
  );
};

export default Game;
