import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, Snackbar, CircularProgress } from '@mui/material';


const Game = ({ username }) => {
  const [questionBody, setQuestionBody] = useState('');
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allanswers, setAllAnswers] = useState([]);
  const [numberClics, setNumberClics] = useState(1);
  const [timer, setTimer] = useState(0);
  const [correctQuestions, setCorrectQuestions] = useState(0);
  const [error, setError] = useState('');
  const [finish, setFinish] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    obtenerPreguntaAleatoria();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const obtenerPreguntaAleatoria = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiEndpoint}/getRandomQuestionTest`);
      setQuestionBody(response.data.questionBody);
      setRespuestaCorrecta(response.data.correcta);
    

      const respuestas=[...response.data.incorrectas]
      respuestas.push (response.data.correcta);
      const respuestasDesordenadas = [];

      while (respuestasDesordenadas.length < 4) {
        const randomIndex = Math.floor(Math.random() * respuestas.length);
        if (!respuestasDesordenadas.includes(respuestas[randomIndex])) {
          respuestasDesordenadas.push(respuestas[randomIndex]);
        }
      }

      setAllAnswers(respuestasDesordenadas);

      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener la pregunta aleatoria", error);
      setIsLoading(false);
    }
  };



  const addGeneratedQuestionBody = async () => {
    try {
      await axios.post(`${apiEndpoint}/addGeneratedQuestion`, {
        generatedQuestionBody: questionBody,
        correctAnswer: respuestaCorrecta
      });

    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleButtonClick = async(respuesta) => {
    if (respuesta == respuestaCorrecta) {
      setCorrectQuestions(correctQuestions + 1);
    }
    setNumberClics(numberClics + 1);
    obtenerPreguntaAleatoria();
    addGeneratedQuestionBody();
    if (numberClics > 10) {
      setFinish(true);
      setIsLoading(false);     
    }
  };

  const handleTimeRemaining = () => {
    let minsR = Math.floor((3 * 60 - timer) / 60);
    let minsRStr = (minsR < 10) ? '0' + minsR.toString() : minsR.toString();
    let secsR = (3 * 60 - timer) % 60;
    let secsRStr = (secsR < 10) ? '0' + secsR.toString() : secsR.toString();
    return `${minsRStr}:${secsRStr}`;
  };

  
    const addRecord = async () => {
      try {
        if ((numberClics > 10 || timer > 180) && !finish) {
          addRecord();
          setFinish(true); 
          setIsLoading(false);    
        }

        await axios.post(`${apiEndpoint}/addRecord`, {
          userId: username,
          date: new Date(),
          time: timer,
          money: (25 * correctQuestions),
          correctQuestions: correctQuestions,
          failedQuestions: (10 - correctQuestions)
        });
      } catch (error) {
        setError(error.response.data.error);
      }
    };

   


  return (
    <Container maxWidth="lg">
      <div>
        {isLoading ? ( // Mostrar la pantalla de carga si isLoading es verdadero
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <CircularProgress />
            <Typography variant="h6" gutterBottom>
              Cargando...
            </Typography>
          </div>
        ) : (
          <>
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
                    {questionBody} 
                  </Typography>
                  <Button key={index} variant="contained" color="primary" onClick={() => handleButtonClick(respuesta)}>
                      {respuesta}
                    </Button>

                  {allanswers.map((respuesta, index) => (
                    <Button key={index} variant="contained" color="primary" onClick={() => handleButtonClick(respuesta)}>
                      {respuesta}
                    </Button>
                  ))}



                </div>
              </>
            )}
          </>
        )}
        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
        )}
      </div>
    </Container>
  );
}

export default Game;
