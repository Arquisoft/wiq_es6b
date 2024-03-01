const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Question = require('./create-model');



const app = express();
const port = 8005;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questiondb';
mongoose.connect(mongoUri);


  // Route for user login
app.post('/addQuestion', async (req, res) => {
  try {
    const newQuestion1 = new Question({
      questionBody: req.body.questionBody,
      typeQuestion: req.body.typeQuestion,
      typeAnswer: req.body.typeAnswer,
  });
  newQuestion1.save();
  res.json(newQuestion1);
  
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//obtiene una pregunta de forma aleatoria
app.post('/getQuestionBody', async (req, res) => {
  try {
    
    //modelo mongo
    const Question = mongoose.model('Question');
    //saco una pregunta de forma aleatoria
    const rQuestion = await Question.aggregate([{ $sample: { size: 1 } }]);
    
    res.json(rQuestion[0]);
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
  