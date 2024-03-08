const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const questionServiceUrl = process.env.QUES_SERVICE_URL || 'http://localhost:8005';
const recordServiceUrl = process.env.REC_SERVICE_URL || 'http://localhost:8006';

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/addRecord', async(req, res) => {
  try{
    const recordResponse = await axios.post(recordServiceUrl+'/addRecord', req.body);
  }catch (error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/getQuestionBody', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const questionResponse = await axios.post(`${questionServiceUrl}/getQuestionBody`);
    res.json(questionResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/addQuestion', async (req, res) => {
  try {
    // Reenviar los datos recibidos en la solicitud POST al servicio de preguntas
    const questionResponse = await axios.post(`${questionServiceUrl}/addQuestion`, req.body);
    res.json(questionResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.get('/getAllUsers', async (req, res) => {
  try {
    // Reenviar la solicitud GET al servicio de usuarios
    const usersResponse = await axios.get(`${userServiceUrl}/getAllUsers`);
    res.json(usersResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
})

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server