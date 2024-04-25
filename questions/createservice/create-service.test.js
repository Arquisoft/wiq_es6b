const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fetch = require('node-fetch');
const Question = require('./create-model');

jest.mock('node-fetch');
jest.mock('./create-model');

let mongoServer;
let app;

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
        Question.aggregate.mockResolvedValue(null);

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
        const response = await request(app).post('/addQuestion').send(questionTest);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody', '¿Cuál es la capital de ');
        expect(response.body).toHaveProperty('typeQuestion', 'pais_capital');
    });

    it('Should perform two addRecord operation /addQuestion', async () => {
        const response2 = await request(app).post('/addQuestion').send(questionTest2);
        expect(response2.status).toBe(200);
        expect(response2.body).toHaveProperty('questionBody', '¿Cual es la poblacion de ');
        expect(response2.body).toHaveProperty('typeQuestion', 'pais_poblacion');
        const response3 = await request(app).post('/addQuestion').send(questionTest3);
        expect(response3.status).toBe(200);
        expect(response3.body).toHaveProperty('questionBody', '¿En que país está ');
        expect(response3.body).toHaveProperty('typeQuestion', 'ciudad_pais');
    });

    it('Should perform a getFullQuestion operation /getFullQuestion', async () => {
        const response = await request(app).get('/getFullQuestion');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('correctAnswer');
        expect(response.body).toHaveProperty('incorrectAnswers');
    });
    
});
