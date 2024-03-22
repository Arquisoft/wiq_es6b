import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Snackbar, Grid, List, ListItem, ListItemText } from '@mui/material';

const Game = ({ username }) => {
  const [question, setQuestion] = useState({});
  const [respuestasAleatorias, setRespuestasAleatorias] = useState([]);
  const [error, setError] = useState('');
  const [correctQuestions, setCorrectQuestions] = useState(0);
  const [timer, setTimer] = useState(0);
  const [numberClics, setNumberClics] = useState(1);
  const [finished, setFinished] = useState(false);
  const totalQuestions = 10;
  const timeLimit = 180;
  const pricePerQuestion = 25;

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    obtenerPreguntaAleatoria();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if(!finished){
        setTimer(timer + 1);
      }else{
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, finished]);

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
    let minsR = Math.floor((timeLimit - timer) / 60);
    let minsRStr = (minsR < 10) ? '0' + minsR.toString() : minsR.toString();
    let secsR = (timeLimit - timer) % 60;
    let secsRStr = (secsR < 10) ? '0' + secsR.toString() : secsR.toString();
    return `${minsRStr}:${secsRStr}`;
  };

  const handleTimeUsed = () => {
    let minsR = Math.floor(timer / 60);
    let minsRStr = (minsR < 10) ? '0' + minsR.toString() : minsR.toString();
    let secsR = timer % 60;
    let secsRStr = (secsR < 10) ? '0' + secsR.toString() : secsR.toString();
    return `${minsRStr}:${secsRStr}`;
  }

  const addRecord = async () => {
    try {
      await axios.post(`${apiEndpoint}/addRecord`, {
        userId: username,
        date: new Date(),
        time: timer,
        money: (pricePerQuestion * correctQuestions),
        correctQuestions: correctQuestions,
        failedQuestions: (totalQuestions - correctQuestions)
      });
    } catch (error) {
      setError(error.response.data.error);
    }
  };

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

  const handleButtonClick = (respuestaSeleccionada) => {
    let newNumberClics = numberClics + 1;
    
    if (respuestaSeleccionada === question.correcta) {
      setCorrectQuestions(correctQuestions + 1);
    }
    addGeneratedQuestionBody();
    setNumberClics(newNumberClics);
    obtenerPreguntaAleatoria();

    if (newNumberClics > totalQuestions || timer > timeLimit) {
      addRecord();
      setFinished(true);
    }
  };


  return (
    <Container maxWidth="lg">
      {numberClics > totalQuestions || timer > timeLimit ? (
            <Grid item xs={12} md={6}>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                ¡Gracias por jugar!
              </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                        primary={`Tiempo transcurrido: ${handleTimeUsed()}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                        primary={`Respuestas correctas: ${correctQuestions}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                        primary={`Respuestas incorrectas: ${totalQuestions-correctQuestions}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                        primary={`Dinero recaudado: ${pricePerQuestion*correctQuestions}`}
                    />
                  </ListItem>
                </List>
            </Grid>
      ) : (
          <>
            <Typography component="h1" variant='h5' sx={{ textAlign: 'center' }}>
                  Pregunta Número {numberClics} :
          </Typography>
          <Typography component="h2" sx={{ textAlign: 'center', color: ((timeLimit-timer) <= 60 && (timer % 60) % 2 === 0) ?
                                                                  'red' : 'inherit',
                                                                fontStyle: 'italic',
                                                                fontWeight: (timer > 150 && (timer % 60) % 2 === 0) ?
                                                                    'bold' : 'inherit' }}>
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
