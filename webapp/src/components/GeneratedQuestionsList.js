
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';

const GeneratedQuestionsList = () => {
 
  const [listquestions, setListquestions] = useState([]);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';



  useEffect(() => {
    const fetchQuestions = async () => {
      try {
       
        const response = await axios.get(`${apiEndpoint}/getAllGeneratedQuestions`);
        if (response.status === 200)  {

            const qList = response.data;
            setListquestions(qList);

        } else {
          console.error('Error obteniendo la lista de preguntas generadas');
        }
      } catch (error) {
        console.error('Error obteniendo la lista de preguntas generadas:', error);
      }
    };

    fetchQuestions();
  }, [apiEndpoint]);


  return (
    <div>
      <h2>Questions List</h2>
      <ul>
        {listquestions.map((question,index) => (
           <li key={index}>Nombre: {question.generatedQuestionBody}, respuesta: {question.correctAnswer}</li>
        ))}
      </ul>
    </div>
  );
};

export default GeneratedQuestionsList;
