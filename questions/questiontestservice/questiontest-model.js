const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({

    questionBody: {
        type: String,
        required: true,
      },
      correcta: {
        type: String,
        required: true,
      },
      incorrectas: {
        type: [],
        required: true,
      },
      numquest: {
        type: Number, 
        required: true,
      },
});

const QuestionGenerator = mongoose.model('QuestionGenerator', questionSchema);

module.exports = QuestionGenerator