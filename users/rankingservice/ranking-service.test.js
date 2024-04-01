const UserRank = require('./ranking-model');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./ranking-service');
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

// Función para eliminar todos los documentos de la colección UserRank después de cada prueba
afterEach(async () => {
  await UserRank.deleteMany({});
});

describe('User Service', () => {
  // Prueba para el endpoint POST /createUserRank
  describe('POST /createUserRank', () => {
    it('should create a new user rank', async () => {
      const newUser = { username: 'testuser' };

      // Realizar una solicitud POST para crear un nuevo ranking de usuario
      const response = await request(app)
        .post('/createUserRank')
        .send(newUser);

      // Verificar el código de estado de la respuesta
      expect(response.status).toBe(200);

      // Verificar si se creó correctamente el nuevo ranking de usuario en la base de datos
      const createdUserRank = await UserRank.findOne({ username: newUser.username });
      expect(createdUserRank).toBeTruthy();
      expect(createdUserRank.username).toBe(newUser.username);
    });
  });

  // Prueba para el endpoint POST /updateRanking
  describe('POST /updateRanking', () => {
    it('should update an existing user rank', async () => {
      // Crear un ranking de usuario existente en la base de datos
      const existingUserRank = new UserRank({
        username: 'existinguser',
        porcentajeAciertos: 50,
        preguntasCorrectas: 20,
        preguntasFalladas: 10,
        numPartidas: 5
      });
      await existingUserRank.save();

      // Datos para la solicitud POST de actualización del ranking de usuario
      const updateData = {
        username: 'existinguser',
        preguntasCorrectas: 5,
        preguntasFalladas: 2,
        numPartidas: 1
      };

      // Realizar una solicitud POST para actualizar el ranking de usuario
      const response = await request(app)
        .post('/updateRanking')
        .send(updateData);

      // Verificar el código de estado de la respuesta
      expect(response.status).toBe(200);

      // Verificar si se actualizó correctamente el ranking de usuario en la base de datos
      const updatedUserRank = await UserRank.findOne({ username: updateData.username });
      expect(updatedUserRank).toBeTruthy();
      expect(updatedUserRank.preguntasCorrectas).toBe(existingUserRank.preguntasCorrectas + updateData.preguntasCorrectas);
      expect(updatedUserRank.preguntasFalladas).toBe(existingUserRank.preguntasFalladas + updateData.preguntasFalladas);
      expect(updatedUserRank.numPartidas).toBe(existingUserRank.numPartidas + updateData.numPartidas);
    });
  });

  // Prueba para el endpoint GET /obtainRank
  describe('GET /obtainRank', () => {
    it('should get all user ranks', async () => {
      // Crear varios rankings de usuarios en la base de datos
      await UserRank.create([
        { username: 'user1', porcentajeAciertos: 60, preguntasCorrectas: 30, preguntasFalladas: 20, numPartidas: 10 },
        { username: 'user2', porcentajeAciertos: 70, preguntasCorrectas: 40, preguntasFalladas: 15, numPartidas: 8 }
      ]);

      // Realizar una solicitud GET para obtener todos los rankings de usuarios
      const response = await request(app).get('/obtainRank');

      // Verificar el código de estado de la respuesta
      expect(response.status).toBe(200);

      // Verificar si se obtuvieron correctamente todos los rankings de usuarios
      expect(response.body.length).toBe(2); // Se espera que haya 2 rankings de usuarios
    });
  });

  describe('User Service (Negative Tests)', () => {
    // Prueba negativa para el endpoint POST /createUserRank
    describe('POST /createUserRank (Negative Test)', () => {
      it('should return 400 if username is missing', async () => {
        // Realizar una solicitud POST sin proporcionar el nombre de usuario
        const response = await request(app)
          .post('/createUserRank')
          .send({});
  
        // Verificar el código de estado de la respuesta
        expect(response.status).toBe(400);
        // Verificar si el cuerpo de la respuesta contiene un mensaje de error
        expect(response.body.error).toBeTruthy();
      });
    });
  
    // Prueba negativa para el endpoint POST /updateRanking
    describe('POST /updateRanking (Negative Test)', () => {
      it('should return 400 if username is missing', async () => {
        // Realizar una solicitud POST sin proporcionar el nombre de usuario
        const response = await request(app)
          .post('/updateRanking')
          .send({});
  
        // Verificar el código de estado de la respuesta
        expect(response.status).toBe(400);
        // Verificar si el cuerpo de la respuesta contiene un mensaje de error
        expect(response.body.error).toBeTruthy();
      });
  
      it('should return 400 if user does not exist', async () => {
        // Datos para la solicitud POST de actualización del ranking de usuario
        const updateData = {
          username: 'nonexistentuser',
          preguntasCorrectas: 5,
          preguntasFalladas: 2,
          numPartidas: 1
        };
  
        // Realizar una solicitud POST para actualizar el ranking de un usuario inexistente
        const response = await request(app)
          .post('/updateRanking')
          .send(updateData);
  
        // Verificar el código de estado de la respuesta
        expect(response.status).toBe(400);
        // Verificar si el cuerpo de la respuesta contiene un mensaje de error
        expect(response.body.error).toBeTruthy();
      });
    });
  
    // Prueba negativa para el endpoint GET /obtainRank
    describe('GET /obtainRank (Negative Test)', () => {
      it('should return 400 if there are no user ranks', async () => {
        // Realizar una solicitud GET cuando no hay rankings de usuarios en la base de datos
        const response = await request(app).get('/obtainRank');
  
        // Verificar el código de estado de la respuesta
        expect(response.status).toBe(400);
        // Verificar si el cuerpo de la respuesta contiene un mensaje de error
        expect(response.body.error).toBeTruthy();
      });
    });
  });
  
});
