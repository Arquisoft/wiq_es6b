const mongoose = require('mongoose');

const generatedQuest = new mongoose.Schema({

    generatedQuestionBody: {
        type: String,
        required: true,
      },
      correctAnswer: {
        type: String,
        required: true,
      },
});

const GeneratedQuestion = mongoose.model('GeneratedQuestion', generatedQuest);

module.exports = GeneratedQuestion