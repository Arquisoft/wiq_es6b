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
  
      // Buscar si ya existe un ranking para el usuario
      const existingUserRank = await UserRank.findOne({ username });
  
      if (existingUserRank) {
        // Si ya existe un ranking para el usuario, actualizar los valores a cero 
          //para actualizarlos despues con los valores de las jugadas
        existingUserRank.porcentajeAciertos = 0;
        existingUserRank.preguntasCorrectas = 0;
        existingUserRank.preguntasFalladas = 0;
        existingUserRank.numPartidas = 0;
  
        await existingUserRank.save();
        res.json(existingUserRank);
      } else {
        // Si no existe un ranking para el usuario, crear uno nuevo
        const newUserRank = new UserRank({
          username,
          porcentajeAciertos: 0,
          preguntasCorrectas: 0,
          preguntasFalladas: 0,
          numPartidas: 0
        });
  
        await newUserRank.save();
        res.json(newUserRank);
      }
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


app.post('/updateAllRanking', async (req, res) => {
  try {
    const rankingData = req.body;

    // Iterar sobre los datos recibidos y actualizar los rankings correspondientes
    for (const userData of rankingData) {
      const username = userData.username;
      const preguntasCorrectas = userData.preguntasCorrectas;
      const preguntasFalladas = userData.preguntasFalladas;
      const numPartidas = userData.numPartidas;

      // Buscar al usuario en la base de datos
      const existingUser = await UserRank.findOne({ username });

      if (!existingUser) {
        // Si el usuario no tiene ranking, crear un nuevo ranking para él
        const newUserRank = new UserRank({
          username,
          porcentajeAciertos: 0,
          preguntasCorrectas,
          preguntasFalladas,
          numPartidas // Al ser el primer registro, el número de partidas es 1
        });

        await newUserRank.save();
      } else {
        // Si el usuario ya existe, actualizar su ranking
        existingUser.preguntasCorrectas += preguntasCorrectas;
        existingUser.preguntasFalladas += preguntasFalladas;
        existingUser.numPartidas += numPartidas;

        const totalPreguntas = existingUser.preguntasCorrectas + existingUser.preguntasFalladas;
        const porcentajeAciertos = (existingUser.preguntasCorrectas / totalPreguntas) * 100;
        existingUser.porcentajeAciertos = porcentajeAciertos.toFixed(2);

        await existingUser.save();
      }
    }

    res.json({ message: 'Rankings actualizados correctamente.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
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