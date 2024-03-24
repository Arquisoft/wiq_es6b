const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const GeneratedQuestion = require('./generatedquest-model');

const app = express();
const port = 8003;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://aswuser:aswuser@wiq06b.hsfgpcm.mongodb.net/questiondb?retryWrites=true&w=majority&appName=wiq06b';
mongoose.connect(mongoUri);


const doesQuestionExist = async (questionBody) => {
  //devuelve true si la pregunta ya existe 
  try {
    const existingQuestion = await GeneratedQuestion.findOne({
      generatedQuestionBody: questionBody
    });

    return !!existingQuestion; // Convertir el resultado en un booleano
  } catch (error) {
    console.error('Error al verificar la existencia de la pregunta:', error);
    return true; // Tratar cualquier error como si la pregunta existiera
  }
};

// Ruta para agregar una nueva pregunta o actualizar si ya existe
app.post('/addOrUpdateQuestionTest', async (req, res) => {
  try {
    // Buscar si ya existe una pregunta con el mismo questionBody
    const existingQuestion = await QuestionTest.findOne({ questionBody: req.body.questionBody });

    if (existingQuestion) {
      // Si la pregunta ya existe, realizar una actualización
      existingQuestion.correcta = req.body.correcta;
      existingQuestion.incorrectas = req.body.incorrectas;
      existingQuestion.numquest = req.body.numquest;

      await existingQuestion.save();
      res.json(existingQuestion); // Devolver la pregunta actualizada
    } else {
      // Si la pregunta no existe, crear una nueva pregunta
      const newQuestion = new QuestionTest({
        questionBody: req.body.questionBody,
        correcta: req.body.correcta,
        incorrectas: req.body.incorrectas,
        numquest: req.body.numquest
      });
      await newQuestion.save();
      res.json(newQuestion); // Devolver la nueva pregunta creada
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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

// Start the server
const server = app.listen(port, () => {
  console.log(`GeneratedQuestions Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server
  