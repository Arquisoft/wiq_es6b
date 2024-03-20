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
    const { questionBody, correctAnswer, incorrectAnswers } = response.data;
    
    // Enviar la pregunta al servicio de preguntas de prueba
    await axios.post(`${apiEndpoint}/addQuestionTest`, {
      questionBody,
      correcta: correctAnswer,
      incorrectas: incorrectAnswers,
      numquest
    });
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
    }, 2000); // Execute every 3 seconds

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId); // Cleanup function to stop interval when component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [numquest]); // Re-run effect when numquest changes

  const handleBeforeUnload = async () => {
    try {
      await axios.delete(`${apiEndpoint}/deleteAllQuestionTest`);
    } catch (error) {
      console.error("Error al ejecutar la limpieza al cerrar la página", error);
    }
  };

  return (
    <React.StrictMode>
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
        Bienvenido a Saber y Ganar
      </Typography>
      <App />
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 4 }}>
        &copy; wiq_6B
      </Typography>
    </React.StrictMode>
  );
};

root.render(<RootComponent />);

reportWebVitals();
