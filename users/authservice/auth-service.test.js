const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const User = require('./auth-model');
const mongoose = require('mongoose');
const server = require('./auth-service');
const fs = require('fs');
const consoleSpy = jest.spyOn(console, 'log');

let mongoServer;
let app;

// Test user
const mockUsername = 'testuser';
const mockPassword = 'testpassword';

const mockUsername2 = 'invalidUser';
const mockPassword2 = 'invalidPassword';

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
  test('POST /login without password field results in Internal Server Error', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: mockUsername,
        // password field is missing
      });
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal Server Error');
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

//test linea 48

test('POST /login with invalid credentials', async () => {
  const response = await request(server)
    .post('/login')
    .send({
      username: mockUsername2,
      password: mockPassword2
    });

  expect(response.statusCode).toBe(401);
  expect(response.body).toHaveProperty('error', 'Invalid credentials');
});

test('should log a message when OpenAPI configuration file is not present', async () => {
  // Setup: rename OpenAPI configuration file
  if (fs.existsSync('./openapi.yaml')) {
    fs.renameSync('./openapi.yaml', './openapi_temp.yaml');
  }

  // Require the server file to trigger the console.log statement
  const server = require('./auth-service');

  expect(consoleSpy).toHaveBeenCalledWith("Not configuring OpenAPI. Configuration file not present.");

  // Teardown: restore OpenAPI configuration file
  if (fs.existsSync('./openapi_temp.yaml')) {
    fs.renameSync('./openapi_temp.yaml', './openapi.yaml');
  }
});

});
