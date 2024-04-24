const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./user-model');
jest.mock('./user-model'); // Mock the User model

require('dotenv').config();

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-service'); 
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('User Service', () => {
  it('should add a new user on POST /adduser', async () => {
    const newUser = {
      username: process.env.TEST_USER,
      password: process.env.TEST_PASSWORD,
    };

    // Mock the User.create method
    User.create.mockResolvedValue(newUser);

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should get all users on GET /getAllUsers', async () => {
    // Mock the User.find method
    User.find.mockResolvedValue([
      { username: process.env.TEST_USER, password: process.env.TEST_PASSWORD },
      { username: process.env.TEST_USER2, password: process.env.TEST_PASSWORD2 },
    ]);

    const response = await request(app).get('/getAllUsers');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    const usernames = response.body.map(user => user.username);
    expect(usernames).toContain('testuser');
    expect(usernames).toContain('testuser2');
  });

      test('should throw an error when a required field is missing', async () => {
        const response = await request(app)
          .post('/adduser')
          .send({ username: 'testuser' }); // password field is missing
      
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing required field: password');
      });
      
});
