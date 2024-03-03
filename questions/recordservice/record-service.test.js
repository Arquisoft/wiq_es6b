const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const Record = require('./record-model');

let mongoServer;
let app;

//test record
const record = {
  userId: 'testuserid',
  date: new Date(),
  time: 60,
  money: 5000,
  correctQuestions: 8,
  failedQuestions: 2
};

async function addRecord(record){
  const newRecord = new Record({
    userId: record.userId,
    date: record.date,
    time: record.time,
    money: record.money,
    correctQuestions: record.correctQuestions,
    failedQuestions: record.failedQuestions
  });

  await newRecord.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./record-service'); 
  //Load database with initial conditions
  await addRecord(record);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Record Service', () => {
  it('Should perform an addRecord operation /addRecord', async () => {
    const response = await request(app).post('/addRecord').send(record);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId', 'testuserid');
  });

  it('Should get user records by userId /getRecords/:userId', async () => {
    const response = await request(app).get(`/getRecords/${record.userId}`);

    expect(response.status).toBe(200);
    expect(response.body.some(record => record.userId === 'testuserid')).toBe(true);
    expect(response.body[0]).toMatchObject(record);
  });

});
