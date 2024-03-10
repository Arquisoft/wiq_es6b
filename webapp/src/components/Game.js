// src/components/Game.js
import axios from 'axios';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
//import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { Container, Typography, Button } from '@mui/material';


//import Link from '@mui/material/Link';

const Game = ({username}) => {
  const [questionBody, setQuestionBody] = useState('');
  const [informacionWikidata, setInformacionWikidata] = useState('');
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('');
  const [respuestasFalsas, setRespuestasFalsas] = useState([]);
  const [numberClics, setNumberClics] = useState(1);
  const [timer, setTimer] = useState(0);
  const [correctQuestions, setCorrectQuestions] = useState(0);
  const [error, setError] = useState('');
  const [finish, setFinish] = useState(false);
  const [buttons, setButtons] = useState([]);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const questionTypes = useMemo(() => ({
    "pais": {
      query: `
        SELECT ?country ?countryLabel ?capital ?capitalLabel
        WHERE {
          ?country wdt:P31 wd:Q6256.
          ?country wdt:P36 ?capital.
          SERVICE wikibase:label {
            bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es".
          }
        }
        ORDER BY RAND()
        LIMIT 150
      `,
      questionLabel: 'countryLabel',
      answerLabel: 'capitalLabel'
    },
    // Añadir el resto de tipos de preguntas
  }), []);

  const obtenerDatos = useCallback(async (questionType) => {
    try {
      const { query, questionLabel, answerLabel } = questionTypes[questionType];

      const apiUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`;
      const headers = { "Accept": "application/json" };

      const respuestaWikidata = await fetch(apiUrl, { headers });

      if (respuestaWikidata.ok) {
        const data = await respuestaWikidata.json();
        const numEles = data.results.bindings.length;

        // Obtener la respuesta correcta
        const indexCorrecta = Math.floor(Math.random() * numEles);
        const resultCorrecta = data.results.bindings[indexCorrecta];
        setInformacionWikidata(resultCorrecta[questionLabel].value + '?');
        setRespuestaCorrecta(resultCorrecta[answerLabel].value);
        //console.log("Obtener datos: answerCorrect: " + respuestaCorrecta);

        // Obtener respuestas falsas
        const respuestas = [];
        for (let i = 0; i < 3; i++) {
          const indexFalsa = Math.floor(Math.random() * numEles);
          const resultFalsa = data.results.bindings[indexFalsa];
          respuestas.push(resultFalsa[answerLabel].value);
        }
        setRespuestasFalsas(respuestas);
      } else {
        console.error("Error al realizar la consulta en Wikidata. Estado de respuesta:", respuestaWikidata.status);
      }
    } catch (error) {
      console.error("Error al realizar la consulta en Wikidata", error);
    }
  }, [questionTypes, setInformacionWikidata, setRespuestaCorrecta, setRespuestasFalsas]);

  const obtenerPreguntaAleatoria = useCallback(async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/getQuestionBody`);
      setQuestionBody(response.data.questionBody);
      await obtenerDatos(response.data.typeQuestion);
    } catch (error) {
      console.error("Error al obtener la pregunta aleatoria", error);
    }
  }, [apiEndpoint, obtenerDatos]);

  useEffect(() => {
    console.log("Bien: "+respuestaCorrecta);
    console.log("Mal: "+respuestasFalsas);
    generarBotonesRespuestas();
  }, [respuestaCorrecta, respuestasFalsas, generarBotonesRespuestas]);

  const generarBotonesRespuestas = async () => {
    try{
      console.log("Generando botones");
      const correctPos = Math.floor(Math.random() * 4) + 1;
      console.log(correctPos);
      const buttonsData = [];
      let contWrongAnsw = 0;
      for(let i=1; i<=4; i++){
        if(i===correctPos){
          console.log("Generando boton correcta: "+respuestaCorrecta);
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

  };

  const handleButtonClickCorrect = () => {
    setCorrectQuestions(correctQuestions+1);
    handleButtonClickGeneric();
  };

  const handleButtonClickGeneric = async () => {
    try{
      setNumberClics(numberClics + 1);
      await obtenerPreguntaAleatoria();
      addGeneratedQuestionBody();
    }catch(error)
    {
    console.error("Error",error)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await obtenerPreguntaAleatoria();
    };
    fetchData();
  }, [obtenerPreguntaAleatoria]);

  const handleTimeRemaining = () => {
    let minsR = Math.floor((3 * 60 - timer) / 60);
    let minsRStr = (minsR < 10) ? '0' + minsR.toString() : minsR.toString();
    let secsR = (3 * 60 - timer) % 60;
    let secsRStr = (secsR < 10) ? '0' + secsR.toString() : secsR.toString();
    return `${minsRStr}:${secsRStr}`;
  };

  const addGeneratedQuestionBody = async () => {
    try {

      let pregunta=`${questionBody || ''} ${informacionWikidata || ''}`;
      await axios.post(`${apiEndpoint}/addGeneratedQuestion`, { 
        generatedQuestionBody: pregunta,
        correctAnswer: respuestaCorrecta
      });
      
    } catch (error) {
      setError(error.response.data.error);
    }
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
    <Container maxWidth="sm">
    <div>
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
              {questionBody} {informacionWikidata}
            </Typography>

            { buttons.map((button) => (
                <Button variant="contained" color="primary" onClick={button.handler} >
                  {button.answer}
                </Button>
            ))}

          </div>
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
