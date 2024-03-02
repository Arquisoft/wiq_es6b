const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const GeneratedQuestion = require('./generatedquest-model');

const app = express();
const port = 8007;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questiondb';
mongoose.connect(mongoUri);


  // Route for user login
app.post('/addGeneratedQuestion', async (req, res) => {
  try {
    const newQuestion = new GeneratedQuestion({
      generatedQuestionBody: req.body.generatedQuestionBody,
      correctAnswer: req.body.correctAnswer,
  });
  newQuestion.save();
  res.json(newQuestion);
  
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//obtencion de todas las preguntas genradas y su respuesta correcta 
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
  console.log(`Auth Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server
  