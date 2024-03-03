const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const Question = require('./create-model');

let mongoServer;
let app;

//test question
const questionTest = {
    questionBody: '¿Cuál es la capital de ',
    typeQuestion: 'pais',
    typeAnswer: 'capital'
};

async function addQuestion(questionTest){
    const newQuestion = new Question({
        questionBody: questionTest.questionBody,
        typeQuestion: questionTest.typeQuestion,
        typeAnswer: questionTest.typeAnswer
    });
    
    await newQuestion.save();
}

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    app = require('./create-service'); 
    //Load database with initial conditions
    await addQuestion(questionTest);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Create Service', () => {
    it('Should perform an addRecord operation /addQuestion', async () => {
        const response = await request(app).post('/addQuestion').send(questionTest);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody', '¿Cuál es la capital de ');
        expect(response.body).toHaveProperty('typeQuestion', 'pais');
        expect(response.body).toHaveProperty('typeAnswer', 'capital');
    });
    
});
