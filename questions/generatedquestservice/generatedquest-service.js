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

// Start the server
const server = app.listen(port, () => {
  console.log(`GeneratedQuestions Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server
  