const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service'); 

afterAll(async () => {
    app.close();
  });

jest.mock('axios');
describe('Gateway Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    } else if (url.endsWith('/addRecord')) {
      // Mock response for addQuestion endpoint
      return Promise.resolve({ data: { recordId: 'mockedRecordId' } });
    } else if (url.endsWith('/addQuestion')) {
      // Mock response for addQuestion endpoint
      return Promise.resolve({ data: { questionId: 'mockedQuestionId' } });
    } else if (url.endsWith('/getAllUsers')) {
      // Mock response for getAllUsers endpoint
      return Promise.resolve({ data: { users: ['user1', 'user2'] } });
    }else if (url.endsWith('/createUserRank')) {
      // Mock response for createUserRank endpoint
      return Promise.resolve({ data: { rankId: 'mockedRankId' } });
    } else if (url.endsWith('/updateRanking')) {
      // Mock response for updateRanking endpoint
      return Promise.resolve({ data: { updatedRanking: true } });
    } else if (url.endsWith('/addQuestionGenerator')) {
      // Mock response for addQuestionGenerator endpoint
      return Promise.resolve({ data: { questionGeneratorId: 'mockedQuestionGeneratorId' } });
    } else if (url.endsWith('/addGeneratedQuestion')) {
      // Mock response for addGeneratedQuestion endpoint
      return Promise.resolve({ data: { generatedQuestionId: 'mockedGeneratedQuestionId' } });
    }
  });


  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const mockUsername = 'testuser';
    const mockPassword = 'testpassword';

    const response = await request(app)
      .post('/login')
      .send({ username: mockUsername, password: mockPassword });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const mockUsername = 'newuser';
    const mockPassword = 'newpassword';

    const response = await request(app)
      .post('/adduser')
      .send({ username: mockUsername, password: mockPassword });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });

  // Test /addRecord endpoint
  it('should add a record successfully', async () => {
    const mockRecord = {
      userId: 'testuserid',
      date: new Date(),
      time: 60,
      money: 5000,
      correctQuestions: 8,
      failedQuestions: 2
    };

    const response = await request(app)
      .post('/addRecord')
      .send(mockRecord);

    expect(response.statusCode).toBe(200);
    expect(response.body.recordId).toBe('mockedRecordId');
  });

 // Test /addQuestion endpoint
 it('should add a question successfully', async () => {
  const mockQuestion = {
    questionBody: 'What is the capital of France?',
    typeQuestion: 'pais'
  };

  const response = await request(app)
    .post('/addQuestion')
    .send(mockQuestion);

  expect(response.statusCode).toBe(200);
  expect(response.body.questionId).toBe('mockedQuestionId');
});

// Test /getAllUsers endpoint
it('should get all users from user service', async () => {
  const response = await request(app)
    .get('/getAllUsers');

  expect(response.statusCode).toBe(200);
  expect(response.body.users).toEqual(['user1', 'user2']);
});

// Test /createUserRank endpoint
it('should create a user rank in ranking service', async () => {
  const response = await request(app)
    .post('/createUserRank')
    .send({ username: 'user123', rank: 'gold' });

  expect(response.statusCode).toBe(200);
  expect(response.body.rankId).toBe('mockedRankId');
});

// Test /updateRanking endpoint
it('should update ranking for a user in ranking service', async () => {
  const response = await request(app)
    .post('/updateRanking')
    .send({ userId: 'user123', newRank: 'platinum' });

  expect(response.statusCode).toBe(200);
  expect(response.body.updatedRanking).toBe(true);
});

// Test /addQuestionGenerator endpoint
it('should add a question generator successfully', async () => {
  const mockQuestionGenerator = {
    questionBody: 'What is the capital of France?',
    typeQuestion: 'pais'
  };

  const response = await request(app)
    .post('/addQuestionGenerator')
    .send(mockQuestionGenerator);

  expect(response.statusCode).toBe(200);
  expect(response.body.questionGeneratorId).toBe('mockedQuestionGeneratorId');
});

// Test /addGeneratedQuestion endpoint
it('should add a generated question successfully', async () => {
  const mockGeneratedQuestion = {
    questionBody: 'What is the capital of France?',
    typeQuestion: 'pais'
  };

  const response = await request(app)
    .post('/addGeneratedQuestion')
    .send(mockGeneratedQuestion);

  expect(response.statusCode).toBe(200);
  expect(response.body.generatedQuestionId).toBe('mockedGeneratedQuestionId');
});

});

