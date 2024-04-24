const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')

const app = express();
app.disable("x-powered-by");
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const questionServiceUrl = process.env.QUES_SERVICE_URL || 'http://localhost:8005';
const recordServiceUrl = process.env.REC_SERVICE_URL || 'http://localhost:8006';
const genQuestServiceUrl = process.env.GEN_SERVICE_URL || 'http://localhost:8003';
const rankingServiceUrl = process.env.RANK_SERVICE_URL || 'http://localhost:8004';
const questiongeneratorservice = process.env.QTEST_SERVICE_URL || 'http://localhost:8007';

let corsOptions = {
  origin: [ authServiceUrl, userServiceUrl, questionServiceUrl, recordServiceUrl, genQuestServiceUrl, rankingServiceUrl, questiongeneratorservice ]
};

app.use(cors(corsOptions));
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
    res.json(recordResponse.data);
  }catch (error){
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
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

app.get('/actRanking', async (req, res) => {
  try {      
      const rankingResponse = await axios.get(`${recordServiceUrl}/actRanking`);
      res.json(rankingResponse.data);
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

app.post('/updateAllRanking', async (req, res) => {
  try {
      // Reenviar la solicitud POST al servicio de ranking para actualizar el ranking de un usuario
      const rankingResponse = await axios.post(`${rankingServiceUrl}/updateAllRanking`, req.body);
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
app.post('/addOrUpdateQuestionGenerator', async (req, res) => {
  try {
    const questionGeneratorResponse = await axios.post(`${questiongeneratorservice}/addOrUpdateQuestionGenerator`, req.body);
    res.json(questionGeneratorResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

//TEMATICAS
app.get('/getRandomQuestionSports', async (req, res) => {
  try {
    const questionGeneratorResponse = await axios.get(`${questiongeneratorservice}/getRandomQuestionDeporte`);
    res.json(questionGeneratorResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.get('/getRandomQuestionImportantDates', async (req, res) => {
  try {
    const questionGeneratorResponse = await axios.get(`${questiongeneratorservice}/getRandomQuestionAnio`);
    res.json(questionGeneratorResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.get('/getRandomQuestionMusic', async (req, res) => {
  try {
    const questionGeneratorResponse = await axios.get(`${questiongeneratorservice}/getRandomQuestionMusica`);
    res.json(questionGeneratorResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.get('/getRandomQuestionLiterature', async (req, res) => {
  try {
    const questionGeneratorResponse = await axios.get(`${questiongeneratorservice}/getRandomQuestionLibro`);
    res.json(questionGeneratorResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.get('/getRandomQuestionCountries', async (req, res) => {
  try {
    const questionGeneratorResponse = await axios.get(`${questiongeneratorservice}/getRandomQuestionPaisYGeo`);
    res.json(questionGeneratorResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});


// Ruta para obtener todas las preguntas de prueba
app.get('/getAllQuestionGenerator', async (req, res) => {
  try {
    const questionGeneratorResponse = await axios.get(`${questiongeneratorservice}/getAllQuestionGenerator`);
    res.json(questionGeneratorResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

// Ruta para obtener todas las preguntas de prueba
app.get('/countQuestionGenerator', async (req, res) => {
  try {
    const questionGeneratorResponse = await axios.get(`${questiongeneratorservice}/countQuestionGenerator`);
    res.json(questionGeneratorResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

// Ruta para eliminar la primera pregunta de prueba
app.delete('/deleteFirstQuestionGenerator', async (req, res) => {
  try {
    const questionGeneratorResponse = await axios.delete(`${questiongeneratorservice}/deleteFirstQuestionGenerator`);
    res.json(questionGeneratorResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});


// Read the OpenAPI YAML file synchronously
const openapiPath='./openapi.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}


// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});


module.exports = server