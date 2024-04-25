const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fetch = require('node-fetch');
const Question = require('./create-model');

jest.mock('node-fetch');
jest.mock('./create-model');

let mongoServer;
let app;

// Define questionTest and questionTest2
const questionTest = {
    question: '¿Cuál es la capital de ',
    type: 'pais'
};
const questionTest2 = {
    question: '¿Cual es la poblacion de ',
    type: 'pais'
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    app = require('./create-service');
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Create Service', () => {
    it('Should respond with an error when /addQuestion fails', async () => {
        const failTest = {
            question: '¿Cuál es la capital de ',
            type: 'pais'
        };

        // Mock the database call
        Question.create.mockImplementation(() => {
            throw new Error('Error');
        });

        const response = await request(app).post('/addQuestion').send(failTest);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('Should respond with an error when /getFullQuestion fails', async () => {
        // Mock the database call
        Question.aggregate.mockResolvedValue(null);

        const response = await request(app).get('/getFullQuestion');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('Should perform an addRecord operation /addQuestion', async () => {
        // Mock the database call
        Question.create.mockResolvedValue({
            _id: 'someId',
            question: questionTest.question,
            type: questionTest.type,
            __v: 0
        });

        const response = await request(app).post('/addQuestion').send(questionTest);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('question');
        expect(response.body).toHaveProperty('type');
    });

    it('Should perform two addRecord operation /addQuestion', async () => {
        // Mock the database call
        Question.create.mockResolvedValue({
            _id: 'someId',
            question: questionTest2.question,
            type: questionTest2.type,
            __v: 0
        });

        const response2 = await request(app).post('/addQuestion').send(questionTest2);
        expect(response2.status).toBe(200);
        expect(response2.body).toHaveProperty('question');
        expect(response2.body).toHaveProperty('type');
    });

    it('Should perform a getFullQuestion operation /getFullQuestion', async () => {
        // Mock the database call
        Question.aggregate.mockResolvedValue([{
            _id: 'someId',
            question: questionTest.question,
            type: questionTest.type,
            __v: 0
        }]);

        const response = await request(app).get('/getFullQuestion');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('question');
        expect(response.body).toHaveProperty('correctAnswer');
        expect(response.body).toHaveProperty('incorrectAnswers');
    });
});