const mongoose = require('mongoose');

const generatedQuest = new mongoose.Schema({

    generatedQuestionBody: {
        type: String,
        required: false,
      },
      correctAnswer: {
        type: String,
        required: false,
      },
});

const GeneratedQuestion = mongoose.model('GeneratedQuestion', generatedQuest);

module.exports = GeneratedQuestion