// src/components/Game.js
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';



import Link from '@mui/material/Link';

const Game=() =>{
    const [questionBody, setquestionBody] =  useState('');//pregunta aleatoria cuerpo
    const [informacionWikidata, setInformacionWikidata] =  useState('');
    const [questionType, setQuestionType] = useState('');;//para el tipo de pregunta a buscar
    const [answerType, setAnswerType] = useState('');;//para el tipo de respuesta a buscar


    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    
    //para el tipo de respuesta a buscar
  
    
      // Obtener pregunta una pregunta aleatoria al acceder a la url 
      const obtenerPreguntaAleatoria = async () => {
        try {
           
            const response = await axios.post(`${apiEndpoint}/getQuestionBody`);
           
           
            setquestionBody(response.data.questionBody);//obtengo los datos del cuerpo de la pregunta
            setQuestionType(response.data.typeQuestion);
            setAnswerType(response.data.typeAnswer);
          
        } catch (error) {
          console.error("Error al obtener la pregunta aleatoria", error);
        }
      };
     
  
      // Obtener info de wikidata segun el tipo de la pregunta y la respuesta para esa pregunta
      //questionType, answerType
      const obtenerPais = async () => {
       
        try {
          // Consulta SPARQL//obtengo  
          const sparqlQuery = `
          SELECT ?country ?countryLabel
          WHERE {
            ?country wdt:P31 wd:Q6256.  # P31 instancias de -> wd:Q6256 (país)
            SERVICE wikibase:label {
              bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es".
            }
          }
          ORDER BY RAND()
          LIMIT 150
          `;
  
          // URL del punto de acceso SPARQL de Wikidata
          const apiUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}`;
  
          const headers = { "Accept": "application/json" };

          //obtengo datos api         
          // Realizar la solicitud con la cabecera adecuada para la API de consulta SPARQL de Wikidata
          const respuestaWikidata = await fetch(apiUrl, {headers});


          if (respuestaWikidata.ok) {
          const data = await respuestaWikidata.json();//obtengo los datos en json
  
          //saco uno de los elementos al azar
          const numEles = data.results.bindings.length;
          const index = Math.floor(Math.random() * numEles);//index al azar
          const result = data.results.bindings[index];
          
          setInformacionWikidata(result.countryLabel.value+`?`);

           } else {
            console.error("Error al realizar la consulta en Wikidata. Estado de respuesta:", respuestaWikidata.status);
          }
        } catch (error) {
          console.error("Error al realizar la consulta en Wikidata", error);
        }

      };
  
      const handleButtonClick = () => {
        obtenerPreguntaAleatoria();
        //pais, libro,actor, edificio 
        if (questionType=='pais'){
        obtenerPais();}
        else if (questionType =='libro'){
          obtenerPais();}
        else if (questionType ==='actor'){
            obtenerPais();}
        else if (questionType=='edificio'){
              obtenerPais();}
        //etc...

      };

    return (
        
        <div>
        <h1>Pregunta: </h1>
        <div>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
           {questionBody} {informacionWikidata} 
          </Typography>

          <Button variant="contained" color="primary" onClick={handleButtonClick}>
            Generar pregunta
          </Button>
        </div>
      </div>
    );
  }

export default Game;
