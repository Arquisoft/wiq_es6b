// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserRank = require('./ranking-model')

const app = express();
const port = 8004;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://aswuser:aswuser@wiq06b.hsfgpcm.mongodb.net/rankingdb?retryWrites=true&w=majority&appName=wiq06b';
mongoose.connect(mongoUri);


app.post('/updateRanking', async (req, res) => {
  try {
    // Buscar al usuariopor su nombre de usuario
    const username = req.body.username;
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


app.post('/createUserRank', async (req, res) => {
  try {
    const { username } = req.body;   
    // Crear un nuevo ranking para el usuario
    const newUserRank = new UserRank({
        username,
        porcentajeAciertos: 0, 
        preguntasCorrectas: 0, 
        preguntasFalladas: 0, 
        numPartidas: 0 
    });

    await newUserRank.save();
    res.json(newUserRank);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/obtainRank', async (req, res) => {
  try {
      
      const rankings = await UserRank.find({});
      res.json(rankings);
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener la lista de rankings.' });
  }
});


const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server