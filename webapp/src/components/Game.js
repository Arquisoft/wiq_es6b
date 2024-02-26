// src/components/Game.js
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';



import Link from '@mui/material/Link';

const Game=() =>{
    const [questionBody, setquestionBody] =  useState('');//pregunta aleatoria cuerpo
    const [informacionWikidata, setInformacionWikidata] =  useState('');
    const [respuestaCorrecta, setRespuestaCorrecta] =  useState('');
    const [questionType, setQuestionType] = useState('');;//para el tipo de pregunta a buscar
    const [answerType, setAnswerType] = useState('');;//para el tipo de respuesta a buscar
    const [numberClics, setNumberClics] = useState(1);

    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    
    //para el tipo de respuesta a buscar
  
    
      // Obtener pregunta una pregunta aleatoria al acceder a la url 
      const obtenerPreguntaAleatoria = async () => {
        try {
           
            const response = await axios.post(`${apiEndpoint}/getQuestionBody`);
           
           
            setquestionBody(response.data.questionBody);//obtengo los datos del cuerpo de la pregunta
            setQuestionType(response.data.typeQuestion);
            setAnswerType(response.data.typeAnswer);

            obtenerDatos(response.data.typeQuestion);
          
        } catch (error) {
          console.error("Error al obtener la pregunta aleatoria", error);
        }
      };

      // Diccionario con el tipo de pregunta y la consulta SPARQL correspondiente
      const questionTypes = {
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
      };

      // Obtener info de wikidata segun el tipo de la pregunta y la respuesta para esa pregunta
      const obtenerDatos = async (questionType) => {
        try {
          const { query, questionLabel, answerLabel } = questionTypes[questionType];
      
          const apiUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`;
          const headers = { "Accept": "application/json" };
      
          const respuestaWikidata = await fetch(apiUrl, {headers});
      
          if (respuestaWikidata.ok) {
            const data = await respuestaWikidata.json();
            const numEles = data.results.bindings.length;
            const index = Math.floor(Math.random() * numEles);
            const result = data.results.bindings[index];
      
            setInformacionWikidata(result[questionLabel].value + '?');
            setRespuestaCorrecta(result[answerLabel].value);
          } else {
            console.error("Error al realizar la consulta en Wikidata. Estado de respuesta:", respuestaWikidata.status);
          }
        } catch (error) {
          console.error("Error al realizar la consulta en Wikidata", error);
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
        ) : (<>
        <h1>Pregunta Número {numberClics} :</h1>
        <div>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
           {questionBody} {informacionWikidata} 
          </Typography>

          <Button variant="contained" color="primary" onClick={handleButtonClick}>
          {respuestaCorrecta}
          </Button>
          
        </div>
        </>
        )}
      </div>
);

  
  }

export default Game;