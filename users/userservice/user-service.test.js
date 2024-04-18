const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

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
    
    const response = await request(app).post('/adduser').send({
      username: process.env.TEST_USER,
      password: process.env.TEST_PASSWORD,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });



      //prueba get
      it('should get all users on GET /getAllUsers', async () => {
        
        // Agrego primero usuarios
        await request(app).post('/adduser').send({
          username: process.env.TEST_USER,
          password: process.env.TEST_PASSWORD,
        });

        await request(app).post('/adduser').send({
          username: process.env.TEST_USER2,
          password: process.env.TEST_PASSWORD2,
  
        });
      // llamo al get
      const response = await request(app).get('/getAllUsers');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);//obtengo elementos
       // miro que esten los dos añadidos
       const usernames = response.body.map(user => user.username);
       expect(usernames).toContain('testuser');
       expect(usernames).toContain('testuser2');

      });
});
