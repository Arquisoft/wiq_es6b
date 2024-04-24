const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const GeneratedQuestion = require('./generatedquest-model');
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')

const app = express();
app.disable("x-powered-by");
const port = 8003;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoUri = `mongodb+srv://${mongoUser}:${mongoPassword}@wiq06b.hsfgpcm.mongodb.net/questiondb?retryWrites=true&w=majority&appName=wiq06b`;
mongoose.connect(mongoUri);


const doesQuestionExist = async (questionBody) => {
  //devuelve true si la pregunta ya existe 
  try {
    const existingQuestion = await GeneratedQuestion.findOne({
      generatedQuestionBody: questionBody.toString()
    });

    return !!existingQuestion; // Convertir el resultado en un booleano
  } catch (error) {
    console.error('Error al verificar la existencia de la pregunta:', error);
    return true; // Tratar cualquier error como si la pregunta existiera
  }
};
// Route to add a new generated question
app.post('/addGeneratedQuestion', async (req, res) => {
  try {
    const { generatedQuestionBody, correctAnswer } = req.body;

    const questionExists = await doesQuestionExist(generatedQuestionBody);
    if (!questionExists) {
      const newQuestion = new GeneratedQuestion({
        generatedQuestionBody,
        correctAnswer,
      });

      await newQuestion.save();

      res.json(newQuestion);
    } else {
      res.status(204).end(); // No Content
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

//obtencion de todas las preguntas generadas y su respuesta correcta 
app.get('/getAllGeneratedQuestions', async (req, res) => {
  try {
    const allQuestions = await GeneratedQuestion.find();

    res.json(allQuestions);

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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

// Start the server
const server = app.listen(port, () => {
  console.log(`GeneratedQuestions Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server
  