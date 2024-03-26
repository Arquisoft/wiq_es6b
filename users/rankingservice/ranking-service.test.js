const request = require('supertest');
const mongoose = require('mongoose');
const UserRank = require('./ranking-model');
const app = require('./ranking-service');

// Utilizando una base de datos en memoria para pruebas
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let mongoUri;

// Configuración de la base de datos en memoria antes de todas las pruebas
beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  mongoUri = await mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
});

// Limpieza de la base de datos en memoria después de todas las pruebas
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Limpieza de la base de datos después de cada prueba
afterEach(async () => {
  await UserRank.deleteMany({});
});

describe('User Service', () => {
  describe('POST /createUserRank', () => {
    it('should create a new user rank', async () => {
      const newUser = { username: 'testuser' };

      const response = await request(app)
        .post('/createUserRank')
        .send(newUser);

      expect(response.status).toBe(200);

      const createdUserRank = await UserRank.findOne({ username: newUser.username });
      expect(createdUserRank).toBeTruthy();
      expect(createdUserRank.username).toBe(newUser.username);
    });
  });

  describe('POST /updateRanking', () => {
    it('should update an existing user rank', async () => {
      const existingUserRank = new UserRank({
        username: 'existinguser',
        porcentajeAciertos: 50,
        preguntasCorrectas: 20,
        preguntasFalladas: 10,
        numPartidas: 5
      });
      await existingUserRank.save();

      const updateData = {
        username: 'existinguser',
        preguntasCorrectas: 5,
        preguntasFalladas: 2,
        numPartidas: 1
      };

      const response = await request(app)
        .post('/updateRanking')
        .send(updateData);

      expect(response.status).toBe(200);

      const updatedUserRank = await UserRank.findOne({ username: updateData.username });
      expect(updatedUserRank).toBeTruthy();
      expect(updatedUserRank.preguntasCorrectas).toBe(existingUserRank.preguntasCorrectas + updateData.preguntasCorrectas);
      expect(updatedUserRank.preguntasFalladas).toBe(existingUserRank.preguntasFalladas + updateData.preguntasFalladas);
      expect(updatedUserRank.numPartidas).toBe(existingUserRank.numPartidas + updateData.numPartidas);
    });
  });

  describe('GET /obtainRank', () => {
    it('should get all user ranks', async () => {
      await UserRank.create([
        { username: 'user1', porcentajeAciertos: 60, preguntasCorrectas: 30, preguntasFalladas: 20, numPartidas: 10 },
        { username: 'user2', porcentajeAciertos: 70, preguntasCorrectas: 40, preguntasFalladas: 15, numPartidas: 8 }
      ]);

      const response = await request(app).get('/obtainRank');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });
});
