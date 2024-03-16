import axios from 'axios';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Typography, Button, Snackbar, CircularProgress } from '@mui/material';

const Game = ({username}) => {
  const [questionBody, setQuestionBody] = useState('');
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('');
  const [respuestasFalsas, setRespuestasFalsas] = useState([]);

  const [numberClics, setNumberClics] = useState(1);
  const [timer, setTimer] = useState(0);
  const [correctQuestions, setCorrectQuestions] = useState(0);
  const [error, setError] = useState('');
  const [finish, setFinish] = useState(false);
  const [buttons, setButtons] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para controlar la pantalla de carga

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const obtenerPreguntaAleatoria = useCallback(async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/getFullQuestion`);
      setQuestionBody(response.data.questionBody);
      setRespuestaCorrecta(response.data.correctAnswer);
      setRespuestasFalsas(response.data.incorrectAnswers);
    } catch (error) {
      console.error("Error al obtener la pregunta aleatoria", error);
    }
  }, [apiEndpoint, questionBody, respuestaCorrecta, respuestasFalsas]);

  const addGeneratedQuestionBody = useCallback(async () => {
    try {

      let pregunta=questionBody;
      await axios.post(`${apiEndpoint}/addGeneratedQuestion`, { 
        generatedQuestionBody: pregunta,
        correctAnswer: respuestaCorrecta
      });
      
    } catch (error) {
      setError(error.response.data.error);
    }
  }, [apiEndpoint, questionBody, respuestaCorrecta]);

  const handleButtonClickGeneric = useCallback(async () => {
    try{
      setNumberClics(numberClics + 1);
      await obtenerPreguntaAleatoria();
      
      addGeneratedQuestionBody();
    }catch(error)
    {
    console.error("Error",error)
    }
  }, [numberClics, obtenerPreguntaAleatoria, addGeneratedQuestionBody]);

  const handleButtonClickCorrect = useCallback(() => {
    setCorrectQuestions(correctQuestions+1);
    handleButtonClickGeneric();
  }, [correctQuestions, handleButtonClickGeneric]);

  const generarBotonesRespuestas = useCallback(async () => {
    try{
      const correctPos = Math.floor(Math.random() * 4) + 1;
      const buttonsData = [];
      let contWrongAnsw = 0;
      for(let i=1; i<=4; i++){
        if(i===correctPos){
          buttonsData.push({ answer: respuestaCorrecta, handler: handleButtonClickCorrect });
        }else{
          buttonsData.push({ answer: respuestasFalsas[contWrongAnsw], handler: handleButtonClickGeneric });
          contWrongAnsw++;
        }
      }
      setButtons(buttonsData);
    }catch(error){
      console.error("Error generando botones", error);
    }

  }, [respuestaCorrecta, respuestasFalsas, handleButtonClickCorrect, handleButtonClickGeneric]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); 
      try {
        await obtenerPreguntaAleatoria();
        await generarBotonesRespuestas();
      } catch (error) {
        console.error("Error al obtener la pregunta o generar botones", error);
        setError("Error al obtener la pregunta o generar botones");
      } finally {
        setIsLoading(false); 
      }
    };
  
    fetchData(); 
  }, [obtenerPreguntaAleatoria, generarBotonesRespuestas]);

  const handleTimeRemaining = () => {
    let minsR = Math.floor((3 * 60 - timer) / 60);
    let minsRStr = (minsR < 10) ? '0' + minsR.toString() : minsR.toString();
    let secsR = (3 * 60 - timer) % 60;
    let secsRStr = (secsR < 10) ? '0' + secsR.toString() : secsR.toString();
    return `${minsRStr}:${secsRStr}`;
  };

  useEffect(() => {
    const addRecord = async () => {
      try {
        //const response = 
        await axios.post(`${apiEndpoint}/addRecord`, {
          userId: username,
          date: new Date(),
          time: timer,
          money: (25*correctQuestions),
          correctQuestions: correctQuestions,
          failedQuestions: (10-correctQuestions)
        });
      } catch (error) {
        setError(error.response.data.error);
      }
    };

    if((numberClics>10 || timer>180) && !finish){
      addRecord();
      setFinish(true);
    }
  }, [apiEndpoint, correctQuestions, finish, username, numberClics, timer]);

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
            <p>Fin de la partida</p>
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

                { buttons.map((button) => (
                    <Button variant="contained" color="primary" onClick={button.handler} >
                      {button.answer}
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
