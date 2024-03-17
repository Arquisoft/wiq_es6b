const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    porcentajeAciertos: {
      type: Number, 
      required: true,
    },
    preguntasCorrectas: {
      type: Number, 
      required: true,
    },
    preguntasFalladas: {
      type: Number, 
      required: true,
    },
    numPartidas: {
      type: Number, 
      required: true,
    },
});

const UserRank = mongoose.model('Ranking', userSchema);

module.exports = UserRank;
