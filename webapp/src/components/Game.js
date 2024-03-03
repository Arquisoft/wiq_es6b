// src/components/Game.js
import axios from 'axios';
import React, { useState, useEffect } from 'react';
//import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';

import {Typography, Button } from '@mui/material';


//import Link from '@mui/material/Link';

const Game=() =>{
    const [questionBody, setQuestionBody] =  useState('');//pregunta aleatoria cuerpo
    const [informacionWikidata, setInformacionWikidata] =  useState('');
    const [respuestaCorrecta, setRespuestaCorrecta] =  useState('');
    //const [questionType, setQuestionType] = useState('');//para el tipo de pregunta a buscar
    //const [answerType, setAnswerType] = useState('');//para el tipo de respuesta a buscar
    const [numberClics, setNumberClics] = useState(1);
    const [timer, setTimer] = useState(0); // estado con el temporizador iniciado a 0 seg

    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


    // se ejecuta una vez cuando se cargue el componente y establece aumentar "timer" en una
    // unidad cada 1000ms
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTime => prevTime + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Función para realizar la petición POST para cargar los tipos de pregunta en la base de datos de mongo
    const peticionPOST = useCallback(async () => {
        try {
            const response = await axios.post(`${apiEndpoint}/addQuestion`, {
                questionBody: '¿Cuál es la capital de ',
                typeQuestion: 'pais',
                typeAnswer: 'capital'
            });
            console.log('Respuesta de la petición POST:', response.data);
        } catch (error) {
            console.error('Error en la petición POST:', error);
        }
    }, []);

    //para el tipo de respuesta a buscar

    // Obtener pregunta una pregunta aleatoria al acceder a la url 
    const obtenerPreguntaAleatoria = useCallback(async () => {
      try {
         
          const response = await axios.post(`${apiEndpoint}/getQuestionBody`);
         
          setQuestionBody(response.data.questionBody);//obtengo los datos del cuerpo de la pregunta
          //setQuestionType(response.data.typeQuestion);
          //setAnswerType(response.data.typeAnswer);

          obtenerDatos(response.data.typeQuestion);
        
      } catch (error) {
        console.error("Error al obtener la pregunta aleatoria", error);
      }
    }, [peticionPOST]);
    
    //useEffect(() => {
    //  obtenerPreguntaAleatoria();
    //}, []);
    // se ejecuta una vez cuando se cargue el componente y llena la BD con las plantillas posibles
    // además de generar la pregunta nº1
    useEffect(() => {
      const fetchData = async () => {
          await peticionPOST(); // Espera a que la primera función se complete
          obtenerPreguntaAleatoria(); // Luego ejecuta la segunda función
      };
      fetchData(); // Llamada a la función async
    }, [obtenerPreguntaAleatoria, peticionPOST]);




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

      const handleTimeRemaining = () => {
          let minsR = Math.floor((3*60-timer)/60);
          let minsRStr = (minsR<10) ? 0+minsR.toString() : minsR.toString()
          let secsR = (3*60-timer)%60;
          let secsRStr = (secsR<10) ? 0+secsR.toString() : secsR.toString()
          return `${minsRStr}:${secsRStr}`;
      };

    return (

        <div>
        {(numberClics > 10 || timer>180) ? (
        <p>Fin</p>
        ) : (<>
        <Typography component="h1" variant='h5' sx={{ textAlign: 'center'}}>
            Pregunta Número {numberClics} :
        </Typography>
        <Typography component="h2" sx={{ textAlign: 'center', color: (timer>120 && (timer%60)%2===0)?'red':'inherit', fontStyle:'italic', fontWeight: (timer>150 && (timer%60)%2===0)?'bold':'inherit'}}>
            ¡Tiempo restante {handleTimeRemaining()}!
        </Typography>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
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
