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
    }else if (url.endsWith('/addQuestion')) {
      // Mock response for addQuestion endpoint
      return Promise.resolve({ data: { questionId: 'mockedQuestionId' } });
    } else if (url.endsWith('/addGeneratedQuestion')) {
      // Mock response for addGeneratedQuestion endpoint
      return Promise.resolve({ data: { generatedQuestionId: 'mockedGeneratedQuestionId' } });
    } else if (url.endsWith('/createUserRank')) {
      // Mock response for createUserRank endpoint
      return Promise.resolve({ data: { rankId: 'mockedRankId' } });
    } else if (url.endsWith('/updateRanking')) {
      // Mock response for updateRanking endpoint
      return Promise.resolve({ data: { updatedRanking: true } });
    } else if (url.endsWith('/addQuestionTest')) {
      // Mock response for addQuestionTest endpoint
      return Promise.resolve({ data: { questionTestId: 'mockedQuestionTestId' } });
    } 
  });


  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });


 // Test /addQuestion endpoint
 it('should add a question successfully', async () => {
  const mockQuestion = {
    questionBody: 'What is the capital of France?',
    typeQuestion: 'pais',
    typeAnswer: 'capital'
  };

  const response = await request(app)
    .post('/addQuestion')
    .send(mockQuestion);

  expect(response.statusCode).toBe(200);
  expect(response.body.questionId).toBe('mockedQuestionId');
});

  // Test /addGeneratedQuestion endpoint
  it('should forward add generated question request to generated question service', async () => {
    const response = await request(app)
      .post('/addGeneratedQuestion')
      .send({ question: 'What is the capital of France?', answer: 'Paris' });

    expect(response.statusCode).toBe(200);
    expect(response.body.generatedQuestionId).toBe('mockedGeneratedQuestionId');
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
  // Test /addQuestionTest endpoint
  /*it('should add a question test in question test service', async () => {
    const response = await request(app)
      .post('/addQuestionTest')
      .send({ question: 'What is the capital of France?', answer: 'Paris' });

    expect(response.statusCode).toBe(200);
    expect(response.body.questionTestId).toBe('mockedQuestionTestId');
  });*/

});

