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


      beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      });
    
      afterAll(async () => {
        await mongoose.connection.close();
      });
    
      test('POST /addGeneratedQuestion', async () => {
        const response = await request(app)
          .post('/addGeneratedQuestion')
          .send({
            generatedQuestionBody: 'Test question',
            correctAnswer: 'Test answer',
          });
    
        expect(response.statusCode).toBe(200);
        expect(response.body.generatedQuestionBody).toBe('Test question');
        expect(response.body.correctAnswer).toBe('Test answer');
      });
    
      test('POST /addGeneratedQuestion - question exists', async () => {
        const response = await request(app)
          .post('/addGeneratedQuestion')
          .send({
            generatedQuestionBody: 'Test question',
            correctAnswer: 'Test answer',
          });
    
        expect(response.statusCode).toBe(204);
      });
    
      test('GET /getAllGeneratedQuestions', async () => {
        const response = await request(app).get('/getAllGeneratedQuestions');
    
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    
      test('Server starts and stops correctly', async () => {
        const server = app.listen(8003);
        expect(server).toBeDefined();
    
        server.close();
        expect(mongoose.connection.readyState).toBe(0); // 0: disconnected
      });
    
});
