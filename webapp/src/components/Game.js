import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Snackbar } from '@mui/material';

const Game = ({ username }) => {
  const [question, setQuestion] = useState({});
  const [respuestasAleatorias, setRespuestasAleatorias] = useState([]);
  const [error, setError] = useState('');
  const [correctQuestions, setCorrectQuestions] = useState(0);
  const [timer, setTimer] = useState(0);
  const [numberClics, setNumberClics] = useState(1);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    obtenerPreguntaAleatoria();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const obtenerPreguntaAleatoria = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/getRandomQuestionTest`);
      setQuestion(response.data);
      const respuestas = [...response.data.incorrectas, response.data.correcta];
      setRespuestasAleatorias(respuestas.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error("Error al obtener la pregunta aleatoria", error);
      setError('Error al obtener la pregunta aleatoria');
    }
  };

  const handleTimeRemaining = () => {
    let minsR = Math.floor((3 * 60 - timer) / 60);
    let minsRStr = (minsR < 10) ? '0' + minsR.toString() : minsR.toString();
    let secsR = (3 * 60 - timer) % 60;
    let secsRStr = (secsR < 10) ? '0' + secsR.toString() : secsR.toString();
    return `${minsRStr}:${secsRStr}`;
  };

  const handleButtonClick = (respuestaSeleccionada) => {
    
    if (respuestaSeleccionada === question.correcta) {
      setCorrectQuestions(correctQuestions + 1);
    }
    //addGeneratedQuestionBody();
    //addRecord();
    setNumberClics(numberClics+1);
    obtenerPreguntaAleatoria();
  };

  /*useEffect(() => {
    if (numberClics > 10 || timer > 180) {
      
      addRecord();
    }
  }, [numberClics, timer]);*/

  const addGeneratedQuestionBody = async () => {
    try {
      await axios.post(`${apiEndpoint}/addGeneratedQuestion`, {
        generatedQuestionBody: question.questionBody,
        correctAnswer: question.correcta
      });

    } catch (error) {
      setError(error.response.data.error);
    }
  };


  const addRecord = async () => {
    try {
      if (numberClics > 10 || timer > 180) {
         
      

      await axios.post(`${apiEndpoint}/addRecord`, {
        userId: username,
        date: new Date(),
        time: timer,
        money: (25 * correctQuestions),
        correctQuestions: correctQuestions,
        failedQuestions: (10 - correctQuestions)
      });
    }
    } catch (error) {
      setError(error.response.data.error);
    }
  };


  return (
    <Container maxWidth="lg">
      {numberClics > 10 || timer > 180 ? (
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          Fin de la partida
        </Typography>
      ) : (
        <>
        <Typography component="h1" variant='h5' sx={{ textAlign: 'center' }}>
                  Pregunta Número {numberClics} :
          </Typography>
          <Typography component="h2" sx={{ textAlign: 'center', color: (timer > 120 && (timer % 60) % 2 === 0) ? 'red' : 'inherit', fontStyle: 'italic', fontWeight: (timer > 150 && (timer % 60) % 2 === 0) ? 'bold' : 'inherit' }}>
            ¡Tiempo restante {handleTimeRemaining()}!
          </Typography>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
            {question.questionBody}
          </Typography>
          {respuestasAleatorias.map((respuesta, index) => (
            <Button
              key={index}
              variant="contained"
              color="primary"
              onClick={() => handleButtonClick(respuesta)}
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
