const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const QuestionGenerator = require('./questiongenerator-model');
const crypto = require('crypto');
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')

require('dotenv').config();

const app = express();
app.disable("x-powered-by");
const port = 8007;

// Middleware para analizar JSON en el cuerpo de la solicitud
app.use(bodyParser.json());

// Connect to MongoDB
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoUri = process.env.MONGODB_URI || `mongodb+srv://aswuser:${mongoPassword}@wiq06b.hsfgpcm.mongodb.net/questiongeneratordb?retryWrites=true&w=majority&appName=wiq06b`;
mongoose.connect(mongoUri);


// Ruta para agregar una nueva pregunta o actualizar si ya existe
app.post('/addOrUpdateQuestionGenerator', async (req, res) => {
  try {
    // Buscar si ya existe una pregunta con el mismo questionBody
    const existingQuestion = await QuestionGenerator.findOne({ questionBody: req.body.questionBody });

    if (existingQuestion) {
      // Si la pregunta ya existe, realizar una actualización
      existingQuestion.correcta = req.body.correcta;
      existingQuestion.incorrectas = req.body.incorrectas;
      existingQuestion.numquest = req.body.numquest;
      existingQuestion.typeQuestion = req.body.typeQuestion; // Asignar el tipo de pregunta desde la solicitud

      await existingQuestion.save();
      res.json(existingQuestion); // Devolver la pregunta actualizada
    } else {
      // Si la pregunta no existe, crear una nueva pregunta
      try {
        const newQuestion = new QuestionGenerator({
          questionBody: req.body.questionBody,
          correcta: req.body.correcta,
          incorrectas: req.body.incorrectas,
          numquest: req.body.numquest, // Agregar el campo numquest desde la solicitud
          typeQuestion: req.body.typeQuestion, // Asignar el tipo de pregunta desde la solicitud
        });
        await newQuestion.save();
        res.json(newQuestion); // Devolver la nueva pregunta creada
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Ruta para obtener todas las preguntas
app.get('/getAllQuestionGenerator', async (req, res) => {
  try {
    const questions = await QuestionGenerator.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para eliminar la primera pregunta de la base de datos
app.delete('/deleteFirstQuestionGenerator', async (req, res) => {
  try {
    const firstQuestion = await QuestionGenerator.findOneAndDelete({}).sort({ createdAt: 1 });
    if (firstQuestion) {
      res.json(firstQuestion);
    } else {
      res.status(404).json({ error: 'No question found in the database' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para obtener el número de preguntas en la base de datos
app.get('/countQuestionGenerator', async (req, res) => {
  try {
    const count = await QuestionGenerator.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/////////////////tematica juego
// Función para obtener una pregunta aleatoria de cualquier tipo
const getRandomQuestion = async (tiposPregunta) => {
  try {
    let filteredTiposPregunta = tiposPregunta;
    let q;

    // Iterar hasta que se encuentre una pregunta válida o no haya más tipos de pregunta disponibles
    while (filteredTiposPregunta.length > 0) {
      // Seleccionar un tipo de pregunta aleatorio de los tipos filtrados
      const tipoPreguntaAleatorio = filteredTiposPregunta[crypto.randomInt(0, filteredTiposPregunta.length)];

      // Consultar una pregunta aleatoria del tipo seleccionado
      const rQuestion = await QuestionGenerator.aggregate([
        { $match: { typeQuestion: tipoPreguntaAleatorio } }, // Filtrar por el tipo de pregunta seleccionado
        { $sample: { size: 1 } } // Seleccionar una pregunta aleatoria
      ]);

      // Verificar si se encontró una pregunta
      if (rQuestion.length > 0) {
        q = rQuestion[0];
        break; // Salir del bucle si se encontró una pregunta válida
      } else {
        // Eliminar el tipo de pregunta filtrado actual de la lista de tipos de pregunta
        filteredTiposPregunta = filteredTiposPregunta.filter(tipo => tipo !== tipoPreguntaAleatorio);
      }
    }

    // Si no se encontró ninguna pregunta válida, lanzar un error
    if (!q) {
      throw new Error('No question found for the specified types');
    }

    return q;
  } catch (error) {
    throw new Error('Internal Server Error');
  }
};

// Rutas para obtener una pregunta aleatoria de diferentes tipos
app.get('/getRandomQuestionDeporte', async (req, res) => {
  try {
    const tiposPregunta = ['equipo_estadio','estadio_capacidad', 'estadio_ciudad', 'equipo_deporte', 'deporte_anio','deportista_anio' ]; // Especificar los tipos de pregunta disponibles
    const q = await getRandomQuestion(tiposPregunta);
    res.json(q);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/getRandomQuestionAnio', async (req, res) => {
  try {
    const tiposPregunta = ['deporte_anio', 'deportista_anio', 'cancion_anio', 'libro_anio', 'cantante_anio']; // Especificar los tipos de pregunta disponibles
    const q = await getRandomQuestion(tiposPregunta);
    res.json(q);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/getRandomQuestionMusica', async (req, res) => {
  try {
    const tiposPregunta = ['cancion_cantante', 'cancion_album', 'cancion_anio', 'cantante_anio']; // Especificar los tipos de pregunta disponibles
    const q = await getRandomQuestion(tiposPregunta);
    res.json(q);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/getRandomQuestionLibro', async (req, res) => {
  try {
    const tiposPregunta = ['libro_autor', 'libro_genero', 'libro_anio']; // Especificar los tipos de pregunta disponibles
    const q = await getRandomQuestion(tiposPregunta);
    res.json(q);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/getRandomQuestionPaisYGeo', async (req, res) => {
  try {
    const tiposPregunta = ['pais_capital', 'pais_poblacion', 'ciudad_pais', 'montana_altura', 'pais_moneda', 'rio_pais', 'lago_pais']; // Especificar los tipos de pregunta disponibles
    const q = await getRandomQuestion(tiposPregunta);
    res.json(q);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//fin tematicas
///////////////////////////////////

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

// Iniciar el servidor
const server = app.listen(port, () => {
  console.log(`Servicio de autenticación escuchando en http://localhost:${port}`);
});

// Manejar el cierre del servidor
server.on('close', () => {
  // Cerrar la conexión de Mongoose
  mongoose.connection.close();
});

module.exports = server;
