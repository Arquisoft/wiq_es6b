const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

//test question
const questionTest = {
    questionBody: '¿Cuál es la capital de ',
    typeQuestion: 'pais',
    typeAnswer: 'capital'
};
const questionTest2 = {
    questionBody: '¿En qué año se descubrió ',
    typeQuestion: 'pais',
    typeAnswer: 'año'
};
const questionTest3 = {
    questionBody: '¿Quién pintó  ',
    typeQuestion: 'cuadro',
    typeAnswer: 'autor'
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
        expect(response.body).toHaveProperty('typeAnswer', 'capital');
    });

    it('Should perform two addRecord operation /addQuestion', async () => {
        const response2 = await request(app).post('/addQuestion').send(questionTest2);
        expect(response2.status).toBe(200);
        expect(response2.body).toHaveProperty('questionBody', '¿En qué año se descubrió ');
        expect(response2.body).toHaveProperty('typeQuestion', 'pais');
        expect(response2.body).toHaveProperty('typeAnswer', 'año');
        const response3 = await request(app).post('/addQuestion').send(questionTest3);
        expect(response3.status).toBe(200);
        expect(response3.body).toHaveProperty('questionBody', '¿Quién pintó  ');
        expect(response3.body).toHaveProperty('typeQuestion', 'cuadro');
        expect(response3.body).toHaveProperty('typeAnswer', 'autor');
    });

    it('Should perform a getFullQuestion operation /getFullQuestion', async () => {
        const response = await request(app).get('/getFullQuestion');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('typeQuestion');
        expect(response.body).toHaveProperty('typeAnswer');
    });

    
});
