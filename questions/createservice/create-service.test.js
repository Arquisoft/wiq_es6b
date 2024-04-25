const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jest = require('jest-mock');

let mongoServer;
let app;

//test question
const questionTest = {
    questionBody: '¿Cuál es la capital de ',
    typeQuestion: 'pais_capital'
};
const questionTest2 = {
    questionBody: '¿Cual es la poblacion de ',
    typeQuestion: 'pais_poblacion'
};
const questionTest3 = {
    questionBody: '¿En que país está ',
    typeQuestion: 'ciudad_pais'
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

        // Mock the request function
        const mockRequest = {
            app: {
                post: jest.fn().mockReturnValue({
                    send: jest.fn().mockResolvedValue({
                        status: 400,
                        body: { error: 'Error' }
                    })
                })
            }
        };

        const response = await request(mockRequest.app).post('/addQuestion').send(failTest);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('Should respond with an error when /getFullQuestion fails', async () => {
        // Mock the request function
        const mockRequest = {
            app: {
                get: jest.fn().mockReturnValue({
                    send: jest.fn().mockResolvedValue({
                        status: 400,
                        body: { error: 'Error' }
                    })
                })
            }
        };

        const response = await request(mockRequest.app).get('/getFullQuestion');
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
