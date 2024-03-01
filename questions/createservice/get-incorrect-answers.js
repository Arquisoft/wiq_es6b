// get-incorrect-answers.js
const Question = require('./create-model');

const getIncorrectAnswers = async (questionId) => {
  try {
    // Obtener la pregunta actual
    const currentQuestion = await Question.findById(questionId);

    // Obtener preguntas aleatorias diferentes de la actual
    const otherQuestions = await Question.aggregate([
      { $match: { _id: { $ne: currentQuestion._id } } },
      { $sample: { size: 3 } }
    ]);

    // Obtener las respuestas de las preguntas aleatorias y la respuesta actual
    const incorrectAnswers = otherQuestions.map((q) => q.typeAnswer);
    incorrectAnswers.push(currentQuestion.typeAnswer);

    return incorrectAnswers;
  } catch (error) {
    console.error('Error al obtener respuestas incorrectas', error);
    throw error;
  }
};

module.exports = getIncorrectAnswers;
