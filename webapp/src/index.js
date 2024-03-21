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
      if (numquest <= 40) {
        obtenerPreguntaspartida(numquest); // Pass current numquest value
        setNumquest(prevNumquest => prevNumquest + 1); // Increment numquest
      } else {
        clearInterval(intervalId); // Detener la generación de preguntas después de 30 iteraciones
      }
    }, 2000); // Ejecutar cada 2 segundos
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      clearInterval(intervalId); // Función de limpieza para detener el intervalo cuando se desmonta el componente
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [numquest]); // Volver a ejecutar el efecto cuando cambia numquest
  

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
