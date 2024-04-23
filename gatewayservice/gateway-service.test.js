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
      return Promise.resolve({ data: { recordId: 'mockedRecordId' } });
    } else if (url.endsWith('/addQuestion')) {
      return Promise.resolve({ data: { questionId: 'mockedQuestionId' } });
    } else if (url.endsWith('/createUserRank')) {
      return Promise.resolve({ data: { rankId: 'mockedRankId' } });
    } else if (url.endsWith('/updateRanking')) {
      return Promise.resolve({ data: { updatedRanking: true } });
    } else if (url.endsWith('/addGeneratedQuestion')) {
      return Promise.resolve({ data: { generatedQuestionId: 'mockedGeneratedQuestionId' } });
    }
  });
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/getAllGeneratedQuestions')) {
      return Promise.resolve({ data: { questions: ['question1', 'question2'] } });
    } else if (url.endsWith('/getAllUsers')) {
      return Promise.resolve({ data: { users: ['user1', 'user2'] } });
    } else if (url.endsWith('/getRecords/:userId')) {
      return Promise.resolve({ data: { records: ['record1', 'record2'] } });
    } else if (url.endsWith('/getFullQuestion')) {
      return Promise.resolve({ data: { question: 'mockedQuestion' } });
    } else if (url.endsWith('/actRanking')) {
      return Promise.resolve({ data: { ranking: 'mockedRanking' } });
    } else if (url.endsWith('/obtainRank')) {
      return Promise.resolve({ data: { rank: 'mockedRank' } });
    } else if (url.endsWith('/getRandomQuestionDeporte') || url.endsWith('/getRandomQuestionAnio')
            || url.endsWith('/getRandomQuestionMusica') || url.endsWith('/getRandomQuestionLibro')
            || url.endsWith('/getRandomQuestionPaisYGeo')) {
      return Promise.resolve({ data: { question: 'mockedQuestion'} });
    } else if (url.endsWith('/getAllQuestionGenerator')) {
      return Promise.resolve({ data: { questions: ['question1', 'question2'] } });
    } else if (url.endsWith('/countQuestionGenerator')) {
      return Promise.resolve({ data: { count: 2 } });
    }
  });
  axios.delete.mockImplementation((url) => {
    if (url.endsWith('/deleteFirstQuestionGenerator')) {
      return Promise.resolve({ data: { success: true } });
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
      questionBody: '¿Cual es la capital de Francia?',
      typeQuestion: 'pais_capital'
    };

    const response = await request(app)
      .post('/addQuestion')
      .send(mockQuestion);

    expect(response.statusCode).toBe(200);
    expect(response.body.questionId).toBe('mockedQuestionId');
  });

  // Test /createUserRank endpoint
  it('should create a user rank in ranking service', async () => {
    const mockUsername = 'testuser';

    const response = await request(app)
      .post('/createUserRank')
      .send({ username: mockUsername });

    expect(response.statusCode).toBe(200);
    expect(response.body.rankId).toBe('mockedRankId');
  });

  // Test /updateRanking endpoint
  it('should update ranking for a user in ranking service', async () => {
    const mockRanking = { username: 'testuser' };

    const response = await request(app)
      .post('/updateRanking')
      .send(mockRanking);

    expect(response.statusCode).toBe(200);
    expect(response.body.updatedRanking).toBe(true);
  });

  // Test /addGeneratedQuestion endpoint success
  it('should add a generated question successfully', async () => {
    const mockGeneratedQuestion = {
      question: '¿Cuál es la capital de Francia?',
      answer: 'París',
      distractor: ['Londres', 'Madrid', 'Berlín']
    };

    const response = await request(app).post('/addGeneratedQuestion').send(mockGeneratedQuestion);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('generatedQuestionId', 'mockedGeneratedQuestionId');
  });

  // Test /getAllGeneratedQuestions endpoint
  it('should get all generated questions from generated question service', async () => {
    const response = await request(app)
      .get('/getAllGeneratedQuestions');

    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toEqual(['question1', 'question2']);
  });

  // Test /getRecords/:userId endpoint
  it('should get all records for a user from record service', async () => {
    const mockUserId = 'testuserid';
    const mockRecords = [
      { recordId: 'record1', userId: mockUserId, score: 100 },
      { recordId: 'record2', userId: mockUserId, score: 200 },
    ];

    // Mock the axios.get implementation for this test
    axios.get.mockImplementationOnce((url) => {
      if (url.endsWith(`/getRecords/${mockUserId}`)) {
        return Promise.resolve({ data: mockRecords });
      }
    });

    const response = await request(app).get(`/getRecords/${mockUserId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockRecords);
  });

  // Test /getAllUsers endpoint
  it('should get all users from user service', async () => {
    const response = await request(app)
      .get('/getAllUsers');

    expect(response.statusCode).toBe(200);
    expect(response.body.users).toEqual(['user1', 'user2']);
  });

  // Test /getFullQuestion endpoint
  it('should get a full question from question service', async () => {
    const response = await request(app)
      .get('/getFullQuestion');

    expect(response.statusCode).toBe(200);
    expect(response.body.question).toBe('mockedQuestion');
  });

  // Test /actRanking endpoint
  it('should get a ranking from ranking service', async () => {
    const response = await request(app)
      .get('/actRanking');

    expect(response.statusCode).toBe(200);
    expect(response.body.ranking).toBe('mockedRanking');
  });

  // Test /obtainRank endpoint
  it('should get a rank from rank service', async () => {
    const response = await request(app)
      .get('/obtainRank');

    expect(response.statusCode).toBe(200);
    expect(response.body.rank).toBe('mockedRank');
  });
  
  // Test /getRandomQuestionXXXXXX endpoints (themes)
  const themes = ['Sports', 'Music', 'ImportantDates', 'Literature', 'Countries'];

  for (const theme of themes) {
    it(`should get a random question from question generator service with theme "${theme}"`, async () => {
      const response = await request(app).get(`/getRandomQuestion${theme}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.question).toBe('mockedQuestion');
    });
  }

  // Test /getAllQuestionGenerator endpoint
  it('should get all questions from question generator service', async () => {
    const response = await request(app)
      .get('/getAllQuestionGenerator');

    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toEqual(['question1', 'question2']);
  });

  // Test /countQuestionGenerator endpoint
  it('should count all questions from question generator service', async () => {
    const response = await request(app)
      .get('/countQuestionGenerator');

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(2);
  });

  // Test /deleteFirstQuestionGenerator endpoint
  it('should delete the first question from question generator service', async () => {
    const response = await request(app)
      .delete('/deleteFirstQuestionGenerator');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });


  // Errors in external services
  async function testEndpointErrorHandling(method, endpoint, data) {
    const axiosMethod = axios[method];
    axiosMethod.mockImplementationOnce(() => Promise.reject(new Error('Error interno del servidor')));
    const response = await request(app)[method](endpoint).send(data);
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error interno del servidor');
  }
  const mockPassword = 'newpassword';

  // Test /login endpoint error handling
  it('should handle error in /login', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject({response: { status: 500, data: { error: 'Error interno del servidor' }}}));
    const response = await request(app).post('/login').send({ username: 'testuser2', password: mockPassword });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error interno del servidor');
  });
  
  // Test /addUser endpoint error handling
  it('should handle error in /addUser', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject({response: { status: 500, data: { error: 'Error interno del servidor' }}}));
    const response = await request(app).post('/addUser').send({ username: 'testuser2', password: mockPassword });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error interno del servidor');
  });

  const testCases = [
    { method: 'post', endpoint: '/login', data: { username: 'testuser2', password: mockPassword } },
    { method: 'post', endpoint: '/addUser', data: { username: 'testuser2', password: mockPassword } },
    { method: 'post', endpoint: '/addGeneratedQuestion', data: { question: '¿Cuál es la capital de Francia?', answer: 'París', distractor: ['Londres', 'Madrid', 'Berlín'] } },
    { method: 'get', endpoint: '/getAllGeneratedQuestions' },
    { method: 'get', endpoint: '/getRecords/:userId' },
    { method: 'get', endpoint: '/getAllUsers' },
    { method: 'get', endpoint: '/getFullQuestion' },
    { method: 'get', endpoint: '/actRanking' },
    { method: 'get', endpoint: '/obtainRank' },
    { method: 'get', endpoint: '/getAllQuestionGenerator' },
    { method: 'get', endpoint: '/countQuestionGenerator' },
    { method: 'delete', endpoint: '/deleteFirstQuestionGenerator' },
  ]; 
  
  testCases.forEach(({ method, endpoint, data }) => {
    it(`should handle error in ${endpoint}`, async () => {
      await testEndpointErrorHandling(method, endpoint, data);
    });
  });

});

