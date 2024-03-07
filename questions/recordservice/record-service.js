const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Record = require('./record-model')

const app = express();
const port = 8006;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/recorddb';
mongoose.connect(mongoUri);

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

// añadir una jugada
app.post('/addRecord', async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, ['userId', 'date', 'time', 'money', 'correctQuestions', 'failedQuestions']);

    const newRecord = new Record({
      userId: req.body.userId,
      date: req.body.date,
      time: req.body.time,
      money: req.body.money,
      correctQuestions: req.body.correctQuestions,
      failedQuestions: req.body.failedQuestions
  });
  newRecord.save();
  res.json(newRecord);
  
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// devuelve todos los historiales
app.get('/getRecords/:userId', async (req, res) => {
  try {
    
    const Record = mongoose.model('Record');
    const userId = req.params.userId;
    
    const userRecords = await Record.find({ userId: userId });
    res.json(userRecords);

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Record Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server
  