const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Record = require('./questiongenerator-model');
const { type } = require('os');

let mongoServer;
let app;

//test question generator
const question = {
    questionBody: "¿Quién escribió la novela 'El Extranjero'?",
    correcta: 'Albert Camus',
    incorrectas: ['George Orwell','Franz Kafka','José Saramago'],
    numquest: 1,
    typeQuestion: 'literatura'
};
const questionUpdated = {
    questionBody: "¿Quién escribió la novela 'El Extranjero'?",
    correcta: 'Albert Camus',
    incorrectas: ['Miguel Delibes','Osamu Dazai','Franz Kafka'],
    numquest: 4,
    typeQuestion: 'literatura'
};
const question2 = {
    questionBody: "¿En qué año se publicó 'Romancero Gitano' de Federico García Lorca?",
    correcta: '1928',
    incorrectas: ['1934','1926','1950'],
    numquest: 2,
    typeQuestion: 'literatura'
};
const question3 = {
    questionBody: "¿En qué año nació 'The Special One' (José Mourinho)?",
    correcta: '1963',
    incorrectas: ['1950','1971','1968'],
    numquest: 3,
    typeQuestion: 'deportes'
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    app = require('./questiongenerator-service');
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('Question Generator Service', () => {
    it('Should perform an addOrUpdate operation /addOrUpdateQuestionGenerator', async () => {
        const response = await request(app).post('/addOrUpdateQuestionGenerator').send(question);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody', "¿Quién escribió la novela 'El Extranjero'?");
        expect(response.body).toHaveProperty('correcta', 'Albert Camus');
        expect(response.body).toHaveProperty('incorrectas', ['George Orwell','Franz Kafka','José Saramago']);
        expect(response.body).toHaveProperty('numquest', 1);
    });

    it('Should perform two addOrUpdate operation /addOrUpdateQuestionGenerator for the same question', async () => {
        const response = await request(app).post('/addOrUpdateQuestionGenerator').send(question);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody', "¿Quién escribió la novela 'El Extranjero'?");
        expect(response.body).toHaveProperty('correcta', 'Albert Camus');
        expect(response.body).toHaveProperty('incorrectas', ['George Orwell','Franz Kafka','José Saramago']);
        expect(response.body).toHaveProperty('numquest', 1);

        // Actualizamos las respuestas incorrectas
        const secondResponse = await request(app).post('/addOrUpdateQuestionGenerator').send(questionUpdated);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody', "¿Quién escribió la novela 'El Extranjero'?");
        expect(response.body).toHaveProperty('correcta', 'Albert Camus');
        expect(response.body).toHaveProperty('incorrectas', ['Miguel Delibes','Osamu Dazai','Franz Kafka']);
        expect(response.body).toHaveProperty('numquest', 1);
    });

    it('Should get the last question added /getAllQuestionGenerator', async () => {
        const response = await request(app).get(`/getAllQuestionGenerator`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });

    it('Should perform two addOrUpdate operation /addOrUpdateQuestionGenerator', async () => {
        const response = await request(app).post('/addOrUpdateQuestionGenerator').send(question3);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody', "¿En qué año nació 'The Special One' (José Mourinho)?");
        expect(response.body).toHaveProperty('correcta', '1963');
        expect(response.body).toHaveProperty('incorrectas', ['1950','1971','1968']);
        expect(response.body).toHaveProperty('numquest', 3);

        const response2 = await request(app).post('/addOrUpdateQuestionGenerator').send(question2);
        expect(response2.status).toBe(200);
        expect(response2.body).toHaveProperty('questionBody', "¿En qué año se publicó 'Romancero Gitano' de Federico " +
                                                                "García Lorca?");
        expect(response2.body).toHaveProperty('correcta', '1928');
        expect(response2.body).toHaveProperty('incorrectas', ['1934','1926','1950']);
        expect(response2.body).toHaveProperty('numquest', 2);
    });

    it('Should get the last question added /getAllQuestionGenerator', async () => {
        const response = await request(app).get(`/getAllQuestionGenerator`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);
    });

    // comienzan los tests para extraer preguntas por temática determinada
    it('Should get one random question /getRandomQuestionDeporte', async () => {
        const response = await request(app).get(`/getRandomQuestionDeporte`);
        const tiposValidos = ['equipo_estadio','estadio_capacidad', 'estadio_ciudad', 'equipo_deporte', 'deporte_anio','deportista_anio' ];

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('correcta');
        expect(response.body).toHaveProperty('incorrectas');
        expect(response.body).toHaveProperty('numquest');
        expect(tiposValidos).toContain(response.body.typeQuestion);
    });
    it('Should get one random question /getRandomQuestionAnio', async () => {
        const response = await request(app).get(`/getRandomQuestionAnio`);
        const tiposValidos = ['deporte_anio', 'deportista_anio', 'cancion_anio', 'libro_anio', 'cantante_anio'];

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('correcta');
        expect(response.body).toHaveProperty('incorrectas');
        expect(response.body).toHaveProperty('numquest');
        expect(tiposValidos).toContain(response.body.typeQuestion);
    });
    it('Should get one random question /getRandomQuestionMusica', async () => {
        const response = await request(app).get(`/getRandomQuestionMusica`);
        const tiposValidos = ['cancion_cantante', 'cancion_album', 'cancion_anio', 'cantante_anio']; 

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('correcta');
        expect(response.body).toHaveProperty('incorrectas');
        expect(response.body).toHaveProperty('numquest');
        expect(tiposValidos).toContain(response.body.typeQuestion);
    });
    it('Should get one random question /getRandomQuestionLibro', async () => {
        const response = await request(app).get(`/getRandomQuestionLibro`);
        const tiposValidos = ['libro_autor', 'libro_genero', 'libro_anio']; 

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('correcta');
        expect(response.body).toHaveProperty('incorrectas');
        expect(response.body).toHaveProperty('numquest');
        expect(tiposValidos).toContain(response.body.typeQuestion);
    });
    it('Should get one random question /getRandomQuestionPaisYGeo', async () => {
        const response = await request(app).get(`/getRandomQuestionPaisYGeo`);
        const tiposValidos = ['pais_capital', 'pais_poblacion', 'ciudad_pais', 'montana_altura', 'pais_moneda', 'rio_pais', 'lago_pais'];

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('correcta');
        expect(response.body).toHaveProperty('incorrectas');
        expect(response.body).toHaveProperty('numquest');
        expect(tiposValidos).toContain(response.body.typeQuestion);
    });
    // fin test extraer preguntas por temática determinada

    it('Should count 2 generated questions in the database /countQuestionGenerator', async () => {
        const response = await request(app).get('/countQuestionGenerator');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('count', 3);
    });

    it('Should delete the first question added /deleteFirstQuestionGenerator', async () => {
       const response = await request(app).delete('/deleteFirstQuestionGenerator');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('correcta');
        expect(response.body).toHaveProperty('incorrectas');
        expect(response.body).toHaveProperty('numquest');
    });

    it('Should count 2 generated questions in the database /countQuestionGenerator', async () => {
        const response = await request(app).get('/countQuestionGenerator');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('count', 2);
    });

    it('Should delete the first reamining question from the database /deleteFirstQuestionGenerator', async () => {
        const response = await request(app).delete('/deleteFirstQuestionGenerator');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('correcta');
        expect(response.body).toHaveProperty('incorrectas');
        expect(response.body).toHaveProperty('numquest');
    });

    it('Should count 1 generated questions in the database /countQuestionGenerator', async () => {
        const response = await request(app).get('/countQuestionGenerator');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('count', 1);
    });

    it('Should delete the last reamining question from the database /deleteFirstQuestionGenerator', async () => {
        const response = await request(app).delete('/deleteFirstQuestionGenerator');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('correcta');
        expect(response.body).toHaveProperty('incorrectas');
        expect(response.body).toHaveProperty('numquest');
    });

    it('Should count 1 generated questions in the database /countQuestionGenerator', async () => {
        const response = await request(app).get('/countQuestionGenerator');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('count', 0);
    });

    it('Should fail while trying to delete because there aren`t more generated questions /deleteFirstQuestionGenerator'
        , async () => {
        const response = await request(app).delete('/deleteFirstQuestionGenerator');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error','No question found in the database');
    });
});
