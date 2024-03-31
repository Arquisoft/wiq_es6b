const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({

    questionBody: {
        type: String,
        required: true,
      },
      typeQuestion: {
        type: String,
        required: true,
      },//para filtrar por el tipo de pregunta
      //autor, year etc...
      //en wikidata se buscaria aleatoriamente para la pregunta un libro y para su respuesta un autor
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question