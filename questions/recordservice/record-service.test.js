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
const record2 = {
  userId: 'testuserid',
  date: new Date(),
  time: 80,
  money: 3000,
  correctQuestions: 6,
  failedQuestions: 4
};
const record3 = {
  userId: 'testuserid2',
  date: new Date(),
  time: 90,
  money: 2000,
  correctQuestions: 5,
  failedQuestions: 5
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
    expect(response.body).toHaveProperty('date', record.date.toISOString());
    expect(response.body).toHaveProperty('time', 60);
    expect(response.body).toHaveProperty('money', 5000);
    expect(response.body).toHaveProperty('correctQuestions', 8);
    expect(response.body).toHaveProperty('failedQuestions', 2);
  });

  it('Should get user records by userId /getRecords/:userId', async () => {
    const response = await request(app).get(`/getRecords/${record.userId}`);
  
    expect(response.status).toBe(200);
    expect(response.body.some(record => record.userId === 'testuserid')).toBe(true);
    
    // Convert the date to a string before comparing
    const expectedRecord = { ...record, date: record.date.toISOString() };
    expect(response.body[0]).toMatchObject(expectedRecord);
  });

  it('Should perform two addRecord operation /addRecord', async () => {
    const response2 = await request(app).post('/addRecord').send(record2);
    expect(response2.status).toBe(200);
    expect(response2.body).toHaveProperty('userId', 'testuserid');
    expect(response2.body).toHaveProperty('date', record2.date.toISOString());
    expect(response2.body).toHaveProperty('time', 80);
    expect(response2.body).toHaveProperty('money', 3000);
    expect(response2.body).toHaveProperty('correctQuestions', 6);
    expect(response2.body).toHaveProperty('failedQuestions', 4);

    const response3 = await request(app).post('/addRecord').send(record3);
    expect(response3.status).toBe(200);
    expect(response3.body).toHaveProperty('userId', 'testuserid2');
    expect(response3.body).toHaveProperty('date', record3.date.toISOString());
    expect(response3.body).toHaveProperty('time', 90);
    expect(response3.body).toHaveProperty('money', 2000);
    expect(response3.body).toHaveProperty('correctQuestions', 5);
    expect(response3.body).toHaveProperty('failedQuestions', 5);
  });

  it('Should get user records by userId /getRecords/:userId', async () => {
    const response = await request(app).get(`/getRecords/nouserid`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);  
  });

  it('Should get user records by userId /getRecords/:userId', async () => {
    const response = await request(app).get(`/getRecords/${record.userId}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

});
