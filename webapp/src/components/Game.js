// src/components/Game.js
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';

const Game = () => {
  const [questionBody, setQuestionBody] = useState('');
  const [informacionWikidata, setInformacionWikidata] = useState('');
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('');
  const [options, setOptions] = useState([]);
  const [numberClics, setNumberClics] = useState(1);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const obtenerPreguntaAleatoria = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/getQuestionBody`);

      setQuestionBody(response.data.questionBody);
      setRespuestaCorrecta(response.data.typeAnswer);

      const optionsResponse = await axios.get(`${apiEndpoint}/getIncorrectAnswers/${response.data._id}`);
      setOptions([...optionsResponse.data.incorrectAnswers, response.data.typeAnswer]);

      obtenerDatos(response.data.typeQuestion);
    } catch (error) {
      console.error('Error al obtener la pregunta aleatoria', error);
    }
  };

  const questionTypes = {
    pais: {
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
      answerLabel: 'capitalLabel',
    },
    // Añadir el resto de tipos de preguntas
  };

  const obtenerDatos = async (questionType) => {
    try {
      const { query, questionLabel, answerLabel } = questionTypes[questionType];

      const apiUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`;
      const headers = { Accept: 'application/json' };

      const respuestaWikidata = await fetch(apiUrl, { headers });

      if (respuestaWikidata.ok) {
        const data = await respuestaWikidata.json();
        const numEles = data.results.bindings.length;
        const index = Math.floor(Math.random() * numEles);
        const result = data.results.bindings[index];

        setInformacionWikidata(result[questionLabel].value + '?');
      } else {
        console.error('Error al realizar la consulta en Wikidata. Estado de respuesta:', respuestaWikidata.status);
      }
    } catch (error) {
      console.error('Error al realizar la consulta en Wikidata', error);
    }
  };

  const handleButtonClick = () => {
    setNumberClics(numberClics + 1);
    obtenerPreguntaAleatoria();
  };

  return (
    <div>
      {numberClics > 10 ? (
        <p>Fin</p>
      ) : (
        <>
          <h1>Pregunta Número {numberClics} :</h1>
          <div>
            <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
              {questionBody} {informacionWikidata}
            </Typography>

            <div>
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant="contained"
                  color={respuestaCorrecta === option ? 'primary' : 'default'}
                  onClick={() => handleButtonClick()}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
