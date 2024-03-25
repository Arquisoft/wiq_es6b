const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Record = require('./record-model')

const app = express();
const port = 8006;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://aswuser:aswuser@wiq06b.hsfgpcm.mongodb.net/recorddb?retryWrites=true&w=majority&appName=wiq06b';
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
  await newRecord.save();
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

// Nuevo endpoint paraactualizar el ranking de los usurias si surgiera algo 
app.get('/actRanking', async (req, res) => {
  try {
    const allRecords = await Record.find();

    const rankingData = {};

    allRecords.forEach(record => {
      const userId = record.userId;
      if (!(userId in rankingData)) {
        rankingData[userId] = {
          username: userId,
          preguntasCorrectas: 0,
          preguntasFalladas: 0,
          numPartidas: 0
        };
      }

      rankingData[userId].preguntasCorrectas += record.correctQuestions;
      rankingData[userId].preguntasFalladas += record.failedQuestions;
      rankingData[userId].numPartidas += 1;
    });

    const rankingArray = Object.values(rankingData);

    res.json(rankingArray);
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
  