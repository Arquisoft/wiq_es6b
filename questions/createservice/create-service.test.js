const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

//test question
const questionTest = {
    questionBody: '¿Cuál es la capital de ',
    typeQuestion: 'pais'
};
const questionTest2 = {
    questionBody: '¿En qué año se descubrió ',
    typeQuestion: 'pais'
};
const questionTest3 = {
    questionBody: '¿Quién pintó  ',
    typeQuestion: 'cuadro'
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
    it('Should perform an addRecord operation /addQuestion', async () => {
        const response = await request(app).post('/addQuestion').send(questionTest);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody', '¿Cuál es la capital de ');
        expect(response.body).toHaveProperty('typeQuestion', 'pais');
    });

    it('Should perform two addRecord operation /addQuestion', async () => {
        const response2 = await request(app).post('/addQuestion').send(questionTest2);
        expect(response2.status).toBe(200);
        expect(response2.body).toHaveProperty('questionBody', '¿En qué año se descubrió ');
        expect(response2.body).toHaveProperty('typeQuestion', 'pais');
        const response3 = await request(app).post('/addQuestion').send(questionTest3);
        expect(response3.status).toBe(200);
        expect(response3.body).toHaveProperty('questionBody', '¿Quién pintó  ');
        expect(response3.body).toHaveProperty('typeQuestion', 'cuadro');
    });

    it('Should respond with an error when /addQuestion fails', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject(new Error('Failed to fetch')) );
    
        const response = await request(app).post('/addQuestion').send(questionTest);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

    it('Should perform a getFullQuestion operation /getFullQuestion', async () => {
        const response = await request(app).get('/getFullQuestion');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('correctAnswer');
        expect(response.body).toHaveProperty('incorrectAnswers');
    });

    it('Should respond with an error when /getFullQuestion fails', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject(new Error('Failed to fetch'))  );

        const response = await request(app).get('/getFullQuestion');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
    
});
