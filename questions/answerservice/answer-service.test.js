const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const Answer = require('./answer-model');

let mongoServer;
let app;

//test answer
const answerTest = {
  
  answerBody: "Cervantes",
  typeAnswer: "autor"
};

async function addanswer(answerTest){
  const newAnswer = new Answer({
    answerBody: answerTest.answerBody,
    typeAnswer: answerTest.typeAnswer
  });

  await newAnswer.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./answer-service'); 
  //Load database with initial conditions
  await addanswer(answerTest);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Answer Service', () => {
  it('Should perform an addRecord operation /addAnswer', async () => {
    const response = await request(app).post('/addAnswer').send(answerTest);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('answerBody', 'Cervantes');
    expect(response.body).toHaveProperty('typeAnswer', 'autor');
  });

});
