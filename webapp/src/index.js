import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Typography from '@mui/material/Typography';
import axios from 'axios'; // Import axios

const root = ReactDOM.createRoot(document.getElementById('root'));
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const obtenerPreguntaspartida = async (numquest) => {
  try {
    const response = await axios.get(`${apiEndpoint}/getFullQuestion`);
    const { questionBody, correctAnswer, incorrectAnswers, typeQuestion } = response.data;
    
    // Enviar la pregunta al servicio de preguntas de prueba
    await axios.post(`${apiEndpoint}/addOrUpdateQuestionGenerator`, {
      questionBody,
      correcta: correctAnswer,
      incorrectas: incorrectAnswers,
      numquest,
      typeQuestion,
    });

    // Verificar si el número de preguntas en la base de datos es mayor que 500
    const countResponse = await axios.get(`${apiEndpoint}/countQuestionGenerator`);
    const count = countResponse.data.count;
    if (count > 500) {
      // Llamar a la función deleteFirstQuestionGenerator para eliminar la primera pregunta
      await axios.delete(`${apiEndpoint}/deleteFirstQuestionGenerator`);
      console.log('Se ha eliminado la primera pregunta de prueba');
    }
  } catch (error) {
    console.error("Error al obtener la pregunta aleatoria", error);
  }
}

const RootComponent = () => {
  const [numquest, setNumquest] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      obtenerPreguntaspartida(numquest); // Pass current numquest value
      setNumquest(prevNumquest => prevNumquest + 1); // Increment numquest
    }, 60000); // Execute every 2 seconds

    return () => {
      clearInterval(intervalId); // Cleanup function to stop interval when component unmounts
    };
  }, [numquest]); // Re-run effect when numquest changes

  return (
    <React.StrictMode>
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
        Bienvenido a Saber y Ganar
      </Typography>
      <App />
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 4 }}>
        &copy; wiq_6b
      </Typography>
    </React.StrictMode>
  );
};

root.render(<RootComponent />);

reportWebVitals();
