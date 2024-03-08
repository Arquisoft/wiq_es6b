// src/components/Game.js
import axios from 'axios';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';



import Link from '@mui/material/Link';

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
      obtenerDatos(response.data.typeQuestion);
    } catch (error) {
      console.error("Error al obtener la pregunta aleatoria", error);
    }
  }, [apiEndpoint, obtenerDatos]);

  useEffect(() => {
    const fetchData = async () => {
      await obtenerPreguntaAleatoria();
    };
    fetchData();
  }, [obtenerPreguntaAleatoria]);

  const handleButtonClickCorrecta = () => {
    setCorrectQuestions(correctQuestions+1);
    handleButtonClick();
  };

  const handleButtonClick = () => {
    setNumberClics(numberClics + 1);
    obtenerPreguntaAleatoria();
  };

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
        const response = await axios.post(`${apiEndpoint}/addRecord`, {
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
  }, [numberClics, timer]);

  return (
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
            <Button variant="contained" color="primary" onClick={handleButtonClickCorrecta}>
              {respuestaCorrecta}
            </Button>

            {/* Mostrar respuestas falsas */}
            {respuestasFalsas.map((respuestaFalsa, index) => (
              <Button key={index} variant="contained" color="secondary" onClick={handleButtonClick}>
                {respuestaFalsa}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Game;
