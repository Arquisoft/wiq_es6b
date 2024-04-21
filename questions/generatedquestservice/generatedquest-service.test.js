const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

//test generated question
const generatedQuestionTest = {
    generatedQuestionBody: '¿Cuál es la capital de España?',
    correctAnswer: 'Madrid',
};
const generatedQuestionTest2 = {
    generatedQuestionBody: '¿En qué año se descubrió América?',
    correctAnswer: '1492',
};
const generatedQuestionTest3 = {
    generatedQuestionBody: '¿Quién pintó la Mona Lisa?',
    correctAnswer: 'Leonardo da Vinci',
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    app = require('./generatedquest-service');
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('Generatedquest Service', () => {
    it('Should perform a getRecord operation /getAllGeneratedQuestions', async () => {
        const response = await request(app).get('/getAllGeneratedQuestions');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0);
    });


    it('Should perform an addRecord operation /addGeneratedQuestion', async () => {
        const response = await request(app).post('/addGeneratedQuestion').send(generatedQuestionTest);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('generatedQuestionBody', '¿Cuál es la capital de España?');
        expect(response.body).toHaveProperty('correctAnswer', 'Madrid');
    });

    it('Should perform a getRecord operation /getAllGeneratedQuestions', async () => {
        const response = await request(app).get('/getAllGeneratedQuestions');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toHaveProperty('generatedQuestionBody', '¿Cuál es la capital de España?');
        expect(response.body[0]).toHaveProperty('correctAnswer', 'Madrid');
    });

    it('Should perform two addRecord operation /addGeneratedQuestion', async () => {
        const response2 = await request(app).post('/addGeneratedQuestion').send(generatedQuestionTest2);
        expect(response2.status).toBe(200);
        expect(response2.body).toHaveProperty('generatedQuestionBody', '¿En qué año se descubrió América?');
        expect(response2.body).toHaveProperty('correctAnswer', '1492');

        const response3 = await request(app).post('/addGeneratedQuestion').send(generatedQuestionTest3);
        expect(response3.status).toBe(200);
        expect(response3.body).toHaveProperty('generatedQuestionBody', '¿Quién pintó la Mona Lisa?');
        expect(response3.body).toHaveProperty('correctAnswer', 'Leonardo da Vinci');
    });

    it('Should perform a getRecord operation /getAllGeneratedQuestions', async () => {
        const response = await request(app).get('/getAllGeneratedQuestions');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
        expect(response.body[0]).toHaveProperty('generatedQuestionBody', '¿Cuál es la capital de España?');
        expect(response.body[0]).toHaveProperty('correctAnswer', 'Madrid');
        expect(response.body[1]).toHaveProperty('generatedQuestionBody', '¿En qué año se descubrió América?');
        expect(response.body[1]).toHaveProperty('correctAnswer', '1492');
        expect(response.body[2]).toHaveProperty('generatedQuestionBody', '¿Quién pintó la Mona Lisa?');
        expect(response.body[2]).toHaveProperty('correctAnswer', 'Leonardo da Vinci');
    });

    it('Not add duplicate question /addGeneratedQuestion', async () => {
        const response = await request(app).post('/addGeneratedQuestion').send(generatedQuestionTest);
        expect(response.status).toBe(204);
    });
});
