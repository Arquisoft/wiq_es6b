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

      // Datos para la supdateRanking updates a user rankinglicitud POST de actualización del ranking de usuario
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
      it('should not create new user rank if user already exists', async () => {
        const existingUser = new UserRank({
          username: 'existinguser',
          porcentajeAciertos: 50,
          preguntasCorrectas: 20,
          preguntasFalladas: 10,
          numPartidas: 5
        });
        await existingUser.save();
    
        // Realizar una solicitud POST para crear un nuevo ranking de usuario con el mismo nombre de usuario
        const response = await request(app)
          .post('/createUserRank')
          .send({ username: existingUser.username }); // Enviamos solo el nombre de usuario existente
    
        // Verificar el código de estado de la respuesta
        expect(response.status).toBe(200);
    
        // Verificar que no se haya creado un nuevo ranking para el usuario existente
        const userRankCount = await UserRank.countDocuments({ username: existingUser.username });
        expect(userRankCount).toBe(1); // Debería seguir siendo solo 1 (el existente)
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
  
  });

test('GET /obtainRank gets all user rankings', async () => {
  const response = await request(app).get('/obtainRank');

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});

it('should reset an existing user rank', async () => {
  // Arrange
  const username = 'testUser';
  const initialUserRank = new UserRank({
    username,
    porcentajeAciertos: 50,
    preguntasCorrectas: 10,
    preguntasFalladas: 10,
    numPartidas: 1
  });
  await initialUserRank.save();

  // Act
  await request(app)
    .post('/createUserRank')
    .send({ usernames: [username] })
    .expect(200);

  // Assert
  const updatedUserRank = await UserRank.findOne({ username });
  expect(updatedUserRank.porcentajeAciertos).toBe(0);
  expect(updatedUserRank.preguntasCorrectas).toBe(0);
  expect(updatedUserRank.preguntasFalladas).toBe(0);
  expect(updatedUserRank.numPartidas).toBe(0);
});

describe('GET /obtainRank', () => {
  it('it should GET all the rankings', async () => {
    const response = await request(app).get('/obtainRank');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

});
