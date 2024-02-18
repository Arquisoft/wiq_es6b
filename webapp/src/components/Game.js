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
           // const { questionBody: questionBodyData } = response.data;
           
            setquestionBody(response.data.questionBody);//obtengo los datos del cuerpo de la pregunta
            //setQuestionType(response.data.typeQuestion);
            //setQuestionType(response.data.typeAnswer);
          
        } catch (error) {
          console.error("Error al obtener la pregunta aleatoria", error);
        }
      };
  
  
      //obtenerPreguntaAleatoria();
      //obtenerInformacionWikidata();
     /* useEffect(() => {
        obtenerPreguntaAleatoria();
    }, []);*/

  
    return (
        
        <div>
        <h1>Pregunta</h1>
        <div>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
            {questionBody} 
          </Typography>

          <Button variant="contained" color="primary" onClick={obtenerPreguntaAleatoria}>
            pregunta
          </Button>
        </div>
      </div>
    );
  }

export default Game;
