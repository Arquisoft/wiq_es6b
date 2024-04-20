const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const User = require('./auth-model');
const { validateRequiredFields } = require('./auth-service');
const mongoose = require('mongoose');

let mongoServer;
let app;

// Test user
const mockUsername = 'testuser';
const mockPassword = 'testpassword';

const user = {
  username: mockUsername,
  password: mockPassword,
};

async function addUser(user){
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = new User({
    username: user.username,
    password: hashedPassword,
  });

  await newUser.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./auth-service'); 
  //Load database with initial conditions
  await addUser(user);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Auth Service', () => {
  it('Should perform a login operation /login', async () => {
    const response = await request(app).post('/login').send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  // Test cubrir linea 25
  test('validateRequiredFields throws error when required field is missing', () => {
    const req = {
      body: {
        username: mockUsername,
      },
    };
  
    expect(() => validateRequiredFields(req, ['username', 'password'])).toThrow('Missing required field: password');
  });

// Testlineas 48-51
test('POST /login with valid credentials returns token and user information', async () => {
  const response = await request(app)
    .post('/login')
    .send({
      username: mockUsername,
      password: mockPassword,
    });

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('token');
  expect(response.body).toHaveProperty('username', mockUsername);
});
// Test linea 68
test('server close event closes Mongoose connection', async () => {
  const closeSpy = jest.spyOn(mongoose.connection, 'close');
  app.close();
  expect(closeSpy).toHaveBeenCalled();
});

});
