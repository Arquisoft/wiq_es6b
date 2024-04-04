const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Record = require('./questiongenerator-model');

let mongoServer;
let app;

//test question generator
const question = {
    questionBody: "¿Quién escribió la novela 'El Extranjero'?",
    correcta: 'Albert Camus',
    incorrectas: ['George Orwell','Franz Kafka','José Saramago'],
    numquest: 1
};
const question2 = {
    questionBody: "¿En qué año se publicó 'Romancero Gitano' de Federico García Lorca?",
    correcta: '1928',
    incorrectas: ['1934','1926','1950'],
    numquest: 2
};
const question3 = {
    questionBody: "¿En qué año nació 'The Special One' (José Mourinho)?",
    correcta: '1963',
    incorrectas: ['1950','1971','1968'],
    numquest: 3
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

    it('Should get one random question /getRandomQuestionGenerator', async () => {
        const response = await request(app).get(`/getRandomQuestionGenerator`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questionBody');
        expect(response.body).toHaveProperty('correcta');
        expect(response.body).toHaveProperty('incorrectas');
        expect(response.body).toHaveProperty('numquest');
    });

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
        expect(response.status).toHaveProperty('error');
    });
});
