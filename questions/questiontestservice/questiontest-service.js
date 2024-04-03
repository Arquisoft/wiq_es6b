const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const QuestionTest = require('./questiontest-model');

const app = express();
const port = 8007;

// Middleware para analizar JSON en el cuerpo de la solicitud
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://aswuser:aswuser@wiq06b.hsfgpcm.mongodb.net/questiontestdb?retryWrites=true&w=majority&appName=wiq06b';
mongoose.connect(mongoUri);


// Ruta para agregar una nueva pregunta
app.post('/addQuestionTest', async (req, res) => {
  try {
    const newQuestion = new QuestionTest({
      questionBody: req.body.questionBody,
      correcta: req.body.correcta,
      incorrectas: req.body.incorrectas,
      numquest: req.body.numquest // Agregar el campo numquest desde la solicitud
    });
    await newQuestion.save();
    res.json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para agregar una nueva pregunta o actualizar si ya existe
app.post('/addOrUpdateQuestionTest', async (req, res) => {
  try {
    // Buscar si ya existe una pregunta con el mismo questionBody
    const existingQuestion = await QuestionTest.findOne({ questionBody: req.body.questionBody });

    if (existingQuestion) {
      // Si la pregunta ya existe, realizar una actualización
      existingQuestion.correcta = req.body.correcta;
      existingQuestion.incorrectas = req.body.incorrectas;
      existingQuestion.numquest = req.body.numquest;

      await existingQuestion.save();
      res.json(existingQuestion); // Devolver la pregunta actualizada
    } else {
      // Si la pregunta no existe, crear una nueva pregunta
      const newQuestion = new QuestionTest({
        questionBody: req.body.questionBody,
        correcta: req.body.correcta,
        incorrectas: req.body.incorrectas,
        numquest: req.body.numquest
      });
      await newQuestion.save();
      res.json(newQuestion); // Devolver la nueva pregunta creada
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para obtener una pregunta por su número de pregunta (numquest)
app.get('/getQuestionTest/:numquest', async (req, res) => {
  try {
    const question = await QuestionTest.findOne({ numquest: req.params.numquest });
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para obtener todas las preguntas
app.get('/getAllQuestionTest', async (req, res) => {
  try {
    const questions = await QuestionTest.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para eliminar todas las preguntas
app.delete('/deleteAllQuestionTest', async (req, res) => {
  try {
    await QuestionTest.deleteMany();
    res.json({ message: 'All questions deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para obtener una pregunta de manera aleatoria
app.get('/getRandomQuestionTest', async (req, res) => {
  try {
    const rQuestion = await QuestionTest.aggregate([{ $sample: { size: 1 } }]);
    const q = rQuestion[0];
      
    res.json(q);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para eliminar la primera pregunta de la base de datos
app.delete('/deleteFirstQuestionTest', async (req, res) => {
  try {
    const firstQuestion = await QuestionTest.findOneAndDelete({}).sort({ createdAt: 1 });
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
app.get('/countQuestionTest', async (req, res) => {
  try {
    const count = await QuestionTest.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
