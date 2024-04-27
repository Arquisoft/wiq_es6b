// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserRank = require('./ranking-model')
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')

require('dotenv').config();

const app = express();
app.disable("x-powered-by");
const port = 8004;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoUri = process.env.MONGODB_URI || `mongodb+srv://aswuser:${mongoPassword}@wiq06b.hsfgpcm.mongodb.net/rankingdb?retryWrites=true&w=majority&appName=wiq06b`;
mongoose.connect(mongoUri);

//actualiza el ranking de un usuario tras terminar la jugada
app.post('/updateRanking', async (req, res) => {
  try {
    // Buscar al usuariopor su nombre de usuario
    const username = req.body.username.toString();
    const existingUser = await UserRank.findOne({ username });

    if (!existingUser) {
        throw new Error(`Usuario '${username}' no encontrado.`);
    }

    existingUser.preguntasCorrectas += parseInt(req.body.preguntasCorrectas);
    existingUser.preguntasFalladas += parseInt(req.body.preguntasFalladas);
    existingUser.numPartidas += 1;

    const totalPreguntas = existingUser.preguntasCorrectas + existingUser.preguntasFalladas;
    const porcentajeAciertos = (existingUser.preguntasCorrectas / totalPreguntas) * 100; //porcentaje de aciertos sobre  suma total de preguntas acertadas+falladas
    existingUser.porcentajeAciertos = porcentajeAciertos.toFixed(2); // Redondear a 2 decimales

    // Guardar los cambios
    await existingUser.save();

    res.json(existingUser);
} catch (error) {
    res.status(400).json({ error: error.message });
}
  
  });

//crea un elemento ranking si no existe 
app.post('/createUserRank', async (req, res) => {
  try {
    const { username } = req.body;

    // Convertir el nombre de usuario en una cadena
    const safeUsername = username.toString();

    // Buscar si ya existe un ranking para el usuario
    const existingUserRank = await UserRank.findOne({ username: safeUsername });

    if (!existingUserRank) {
      // Si no existe un ranking para el usuario, crear uno nuevo
      const newUserRank = new UserRank({
        username: safeUsername,
        porcentajeAciertos: 0,
        preguntasCorrectas: 0,
        preguntasFalladas: 0,
        numPartidas: 0
      });

      await newUserRank.save();
    }

    // Respuesta inmediata al cliente indicando que la operación se ha completado con éxito
    res.json({ message: 'Rankings de usuarios creados o actualizados correctamente.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/obtainRank', async (req, res) => {
  try {
      
      const rankings = await UserRank.find({});
      res.json(rankings);
  } catch (error) {
      res.status(400).json({ error: 'Error al obtener la lista de rankings.' });
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

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server