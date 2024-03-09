
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
  <table style={{ borderCollapse: 'collapse', width: '100%' }}>
    <thead>
      <tr style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>
        <th>ID</th>
        <th>Pregunta</th>
        <th>Respuesta Correcta</th>
      </tr>
    </thead>
    <tbody>
      {listquestions.map((question, index) => (
        <tr key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{question.generatedQuestionBody}</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{question.correctAnswer}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


  );
};

export default GeneratedQuestionsList;
