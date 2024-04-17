// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserRank = require('./ranking-model')
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')

const app = express();
const port = 8004;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://aswuser:aswuser@wiq06b.hsfgpcm.mongodb.net/rankingdb?retryWrites=true&w=majority&appName=wiq06b';
mongoose.connect(mongoUri);

//actualiza el ranking de un usuario tras terminar la jugada
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

//crea un elemento ranking si no existe y si existe lo deja a 0 para actualizar a posterior sus datos
//tambien actualiza si se elimino un usuario de eliminar el elemento ranking correspondiente
app.post('/createUserRank', async (req, res) => {
  try {
    const { usernames } = req.body;

    await deleteRankingElements(usernames);

    // Iterar sobre cada nombre de usuario recibido
    for (const username of usernames) {
      // Buscar si ya existe un ranking para el usuario
      const existingUserRank = await UserRank.findOne({ username });

      if (existingUserRank) {
        // Si ya existe un ranking para el usuario, actualizar los valores a cero 
        // para actualizarlos después con los valores de las jugadas
        existingUserRank.porcentajeAciertos = 0;
        existingUserRank.preguntasCorrectas = 0;
        existingUserRank.preguntasFalladas = 0;
        existingUserRank.numPartidas = 0;

        await existingUserRank.save();
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
      }
    }

    res.json({ message: 'Rankings de usuarios creados o actualizados correctamente.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//actualiza si se elimino un usuario de eliminar el elemento ranking correspondiente
async function deleteRankingElements(usernames) {
  try {
    // Obtener todos los elementos de ranking
    const allUserRanks = await UserRank.find({});

    // Crear un conjunto de nombres de usuario en la lista recibida
    const usernamesSet = new Set(usernames);

    // Iterar sobre cada elemento de ranking
    for (const userRank of allUserRanks) {
      // Verificar si el nombre de usuario del elemento de ranking no está en la lista recibida
      if (!usernamesSet.has(userRank.username)) {
        // Si el nombre de usuario no está en la lista, eliminar el elemento de ranking
        await UserRank.deleteOne({ username: userRank.username });
      }
    }
  } catch (error) {
    throw new Error('Error al actualizar los rankings de usuarios: ' + error.message);
  }
}

app.get('/obtainRank', async (req, res) => {
  try {
      
      const rankings = await UserRank.find({});
      res.json(rankings);
  } catch (error) {
      res.status(400).json({ error: 'Error al obtener la lista de rankings.' });
  }
});

//actualiza al inicio los rankings si hubo algun cambio en la base de datos
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

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server