const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const Answer = require('./create-model');

let mongoServer;
let app;

//test generated question
const generatedQuestionTest = {
    generatedQuestionBody: '¿Cuál es la capital de España?',
    correctAnswer: 'Madrid',
};

async function addGeneratedQuestion(generatedQuestionTest){
    const newGeneratedQuestion = new GeneratedQuestion({
        generatedQuestionBody: generatedQuestionTest.generatedQuestionBody,
        correctAnswer: generatedQuestionTest.correctAnswer
    });
    
    await newGeneratedQuestion.save();
}

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    app = require('./generatedquest-service'); 
    //Load database with initial conditions
    await addGeneratedQuestion(generatedQuestionTest);
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('Generatedquest Service', () => {
    it('Should perform an addRecord operation /addGeneratedQuestion', async () => {
        const response = await request(app).post('/addGeneratedQuestion').send(generatedQuestionTest);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('generatedQuestionBody', '¿Cuál es la capital de España?');
        expect(response.body).toHaveProperty('correctAnswer', 'Madrid');
    });
    
});
