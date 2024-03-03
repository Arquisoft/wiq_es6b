const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({

    answerBody: {
        type: String,
        required: true,
      },
      typeAnswer: {
        type: String,
        required: true,
      },//para filtrar por el tipo de pregunta
      //autor, year etc...
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer