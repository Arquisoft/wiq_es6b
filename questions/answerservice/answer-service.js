const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Question = require('./answer-model');
const Answer = require('./answer-model');

const app = express();
const port = 8004;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://aswuser:aswuser@wiq06b.hsfgpcm.mongodb.net/questiondb?retryWrites=true&w=majority&appName=wiq06b';
mongoose.connect(mongoUri);


  // Route for user login
app.post('/addAnswer', async (req, res) => {
  try {
    const newAnswer1 = new Answer({
      answerBody: req.body.answerBody,
      typeAnswer: req.body.typeAnswer,
  });
  newAnswer1.save();
  res.json(newAnswer1);
  
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
  