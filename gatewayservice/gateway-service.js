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
const genQuestServiceUrl = process.env.GEN_SERVICE_URL || 'http://localhost:8003';
const rankingServiceUrl = process.env.RANK_SERVICE_URL || 'http://localhost:8004';
const questiontestservice = process.env.QTEST_SERVICE_URL || 'http://questiontestservice:8007';


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
    if(error.response==undefined){
      // usuario ya registrado
      res.status(500).json( { error : "That username is already registered"} );
    }else{
      res.status(error.response.status).json({ error: error.response.data.error });
    }
  }
});

app.post('/addRecord', async(req, res) => {
  try{
    const recordResponse = await axios.post(recordServiceUrl+'/addRecord', req.body);
  }catch (error){
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



app.post('/addGeneratedQuestion', async (req, res) => {
  try {
    // Reenviar la solicitud GET al servicio de usuarios
   
    const genQuestResponse = await axios.post(genQuestServiceUrl+'/addGeneratedQuestion', req.body);
    res.json(genQuestResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
})

app.get('/getAllGeneratedQuestions', async (req, res) => {
  try {
    // Reenviar la solicitud GET al servicio de usuarios
    const genQuestResponse = await axios.get(`${genQuestServiceUrl}/getAllGeneratedQuestions`);
    
    res.json(genQuestResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
})

app.get('/getRecords/:userId', async (req, res) => {
  try {
 
    const userId = req.params.userId;

    const recordsResponse = await axios.get(`${recordServiceUrl}/getRecords/${userId}`);
    res.json(recordsResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.get('/getFullQuestion', async (req, res) => {
  try {
    // Realizar una solicitud GET al servicio de preguntas para obtener una pregunta completa
    const questionResponse = await axios.get(`${questionServiceUrl}/getFullQuestion`);
    res.json(questionResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});


////////////////////////ranking
app.post('/createUserRank', async (req, res) => {
  try {
      const { username } = req.body;

      // Reenviar la solicitud POST al servicio de ranking para crear un ranking para el usuario
      const rankingResponse = await axios.post(`${rankingServiceUrl}/createUserRank`, req.body);
      res.json(rankingResponse.data);
  } catch (error) {
      if (error.response) {
          res.status(error.response.status).json({ error: error.response.data.error });
      } else {
          res.status(500).json({ error: 'Error interno del servidor' });
      }
  }
});


app.get('/obtainRank', async (req, res) => {
  try {
      // Reenviar la solicitud GET al servicio de ranking para obtener toda la lista de rankings
      const rankingsResponse = await axios.get(`${rankingServiceUrl}/obtainRank`);
      res.json(rankingsResponse.data);
  } catch (error) {
      if (error.response) {
          res.status(error.response.status).json({ error: error.response.data.error });
      } else {
          res.status(500).json({ error: 'Error interno del servidor' });
      }
  }
});

app.post('/updateRanking', async (req, res) => {
  try {
      // Reenviar la solicitud POST al servicio de ranking para actualizar el ranking de un usuario
      const rankingResponse = await axios.post(`${rankingServiceUrl}/updateRanking`, req.body);
      res.json(rankingResponse.data);
  } catch (error) {
      if (error.response) {
          res.status(error.response.status).json({ error: error.response.data.error });
      } else {
          res.status(500).json({ error: 'Error interno del servidor' });
      }
  }
});


///////////////para los question del juego
// Ruta para agregar una pregunta de prueba
app.post('/addOrUpdateQuestionTest', async (req, res) => {
  try {
    const questionTestResponse = await axios.post(`${questiontestservice}/addQuestionTest`, req.body);
    res.json(questionTestResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

// Ruta para obtener una pregunta de prueba por su ID
app.get('/getQuestionTest/:id', async (req, res) => {
  try {
    const questionTestResponse = await axios.get(`${questiontestservice}/getQuestionTest/${req.params.id}`);
    res.json(questionTestResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

// Ruta para obtener una pregunta de prueba por su ID
app.get('/getRandomQuestionTest', async (req, res) => {
  try {
    const questionTestResponse = await axios.get(`${questiontestservice}/getRandomQuestionTest`);
    res.json(questionTestResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});


// Ruta para obtener todas las preguntas de prueba
app.get('/getAllQuestionTest', async (req, res) => {
  try {
    const questionTestResponse = await axios.get(`${questiontestservice}/getAllQuestionTest`);
    res.json(questionTestResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

// Ruta para eliminar todas las preguntas de prueba
app.delete('/deleteAllQuestionTest', async (req, res) => {
  try {
    const questionTestResponse = await axios.delete(`${questiontestservice}/deleteAllQuestionTest`);
    res.json(questionTestResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});


// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});


module.exports = server