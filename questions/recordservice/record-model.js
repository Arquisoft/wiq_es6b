const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({

      userId: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: Number, // en segundos
        required: true,
      },
      money: {
        type: Number, // en euros
        required: true,
      },
      correctQuestions: {
        type: Number,
        required: true,
      },
      failedQuestions: {
        type: Number,
        required: true,
      }

});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record