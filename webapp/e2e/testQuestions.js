const { MongoClient, ObjectId} = require('mongodb');

async function insertTestData() {
    const uri = process.env.MONGODB_URI; 
    const client = new MongoClient(uri);

    console.log('Inserting test data... ' + uri);

    try {
        await client.connect(); 
        const database = client.db(); 

        const questionsGeneratorCollection = database.collection('questiongenerators');
        const generatedQuestionsCollection = database.collection('generatedquestions');
        const questionsCollection = database.collection('questions');

        await generatedQuestionsCollection.insertMany([
            {
                _id : new ObjectId('6631e44be54c89c0eeca947a'),
                generatedQuestionBody: '¿Cual es la poblacion de Maldivas?',
                correctAnswer: '436330',
            },
            { 
                _id : new ObjectId('66185ec83a6bade7b8c1210b'),
                generatedQuestionBody: '¿En que pais se encuentra el rio Río Colorado?',
                correctAnswer: 'Estados Unidos',
            },
            { 
                _id : new ObjectId('66185ed83a6bade7b8c1211f'),
                generatedQuestionBody: '¿En qué album está la canción Calling All Girls?',
                correctAnswer: 'Hot Space',
            },
            { 
                _id : new ObjectId('66185ed33a6bade7b8c1210f'),
                generatedQuestionBody: '¿En qué país está Resovia?',
                correctAnswer: 'Polonia',
            },
            { 
                _id : new ObjectId('66185ef33a6bade7b8c1212a'),
                generatedQuestionBody: '¿En que año se publicó el libro Escultismo para muchachos?',
                correctAnswer: '1908',
            },
            { 
                _id : new ObjectId('66185ef43a6bade7b8c1212e'),
                generatedQuestionBody: '¿Cuál es la capital de República Dominicana?',
                correctAnswer: 'Santo Domingo',
            },
            { 
                _id : new ObjectId('66185ef43a6bade7bbc1212e'),
                generatedQuestionBody: '¿En qué estadio juega el Roda JC?',
                correctAnswer: 'Parkstad Limburg Stadion',
            },
            { 
                _id : new ObjectId('66185ef43aebade7b8c12130'),
                generatedQuestionBody: '¿Cual es el autor del libro Handbook of the Bromeliaceae?',
                correctAnswer: 'John Gilbert Baker',
            },
            { 
                _id : new ObjectId('66185ef93a6bad67b8c12143'),
                generatedQuestionBody: '¿Cuál es la capacidad del estadio Melbourne Cricket Ground?',
                correctAnswer: '100024',
            },
            { 
                _id : new ObjectId('66185efc3a6bade7bbc12148'),
                generatedQuestionBody: '¿En que año nacio Fernanda Abreu?',
                correctAnswer: '1961',
            }
        ])
        
        await questionsGeneratorCollection.insertMany([

            {
                _id : new ObjectId('6631e44be54c89c0eeca947b'),
                questionBody: '¿Cual es la poblacion de Maldivas?',
                correcta: '436330',
                incorrectas: ['101489','8654900','37466414'],
                numquest: 10,
                typeQuestion:'pais_poblacion'
            },
            { 
                _id : new ObjectId('66185ec83a6bade7b8c12104'),
                questionBody: '¿En que pais se encuentra el rio Río Colorado?',
                correcta: 'Estados Unidos',
                incorrectas: ['Rusia','Italia','México'],
                numquest: 3904,
                typeQuestion:'rio_pais'
            },
            { 
                _id : new ObjectId('66185ed83a6bade7b8c12114'),
                questionBody: '¿En qué album está la canción Calling All Girls?',
                correcta: 'Hot Space',
                incorrectas: ['X','Scary Monsters (and Super Creeps)','Vous remercier'],
                numquest: 4027,
                typeQuestion:'cancion_album'
            },
            { 
                _id : new ObjectId('66185ed33a6bade7b8c1210c'),
                questionBody: '¿En qué país está Resovia?',
                correcta: 'Polonia',
                incorrectas: ['Suiza','Canadá','Reino Unido'],
                numquest: 133,
                typeQuestion:'ciudad_pais'
            },
            { 
                _id : new ObjectId('66185ef33a6bade7b8c12124'),
                questionBody: '¿En que año se publicó el libro Escultismo para muchachos?',
                correcta: '1908',
                incorrectas: ['1975','1790','1901'],
                numquest: 92,
                typeQuestion:'libro_anio'
            },
            { 
                _id : new ObjectId('66185ef43a6bade7b8c12129'),
                questionBody: '¿Cuál es la capital de República Dominicana?',
                correcta: 'Santo Domingo',
                incorrectas: ['Mascate','Seúl','Moroni'],
                numquest: 13,
                typeQuestion:'pais_capital'
            },
            { 
                _id : new ObjectId('66185ef43a6bade7b8c1212e'),
                questionBody: '¿En qué estadio juega el Roda JC?',
                correcta: 'Parkstad Limburg Stadion',
                incorrectas: ['Bilino Polje','Estadio Givi Kiladze','Estadio Galgenwaard'],
                numquest: 3917,
                typeQuestion:'equipo_estadio'
            },
            { 
                _id : new ObjectId('66185ef43a6bade7b8c12130'),
                questionBody: '¿Cual es el autor del libro Handbook of the Bromeliaceae?',
                correcta: 'John Gilbert Baker',
                incorrectas: ['Édouard-François André','John Flinders Petrie','Harold Scott MacDonald Coxeter'],
                numquest: 3961,
                typeQuestion:'libro_autor'
            },
            { 
                _id : new ObjectId('66185ef93a6bade7b8c12143'),
                questionBody: '¿Cuál es la capacidad del estadio Melbourne Cricket Ground?',
                correcta: '100024',
                incorrectas: ['6390','68756','3000'],
                numquest: 3927,
                typeQuestion:'estadio_capacidad'
            },
            { 
                _id : new ObjectId('66185efc3a6badd7b8c12148'),
                questionBody: '¿En que año nacio Fernanda Abreu?',
                correcta: '1961',
                incorrectas: ['1964','1947','1976'],
                numquest: 3928,
                typeQuestion:'cantante_anio'
            }
        ]);


        await questionsGeneratorCollection.insertMany([
            {
                _id : new ObjectId('66185efc3a6bade7b8c12148'),
                questionBody : '¿Cuál es la capital de ',
                typeQuestion : 'pais_capital'
            },
            {
                _id : new ObjectId('660b3450a5a2375248197a34'),
                questionBody : '¿En que año se publicó el libro ',
                typeQuestion : 'libro_anio'
            },
            {
                _id : new ObjectId('66118e1bd67d6feb6eebe7ca'),
                questionBody : '¿En que pais se encuentra el rio ',
                typeQuestion : 'rio_pais'
            },
            {
                _id : new ObjectId('65fb54e2e2129f6cc1cadef5'),
                questionBody : '¿Cual es la poblacion de ',
                typeQuestion : 'pais_poblacion'
            },
            {
                _id : new ObjectId('660f1f53b00ebaeae8a063d7'),
                questionBody : '¿En qué album está la canción ',
                typeQuestion : 'cancion_album'
            },
            {
                _id : new ObjectId('65fcbeb30a9bf89abca95bc9'),
                questionBody : '¿En qué país está ',
                typeQuestion : 'ciudad_pais'
            },
            {
                _id : new ObjectId('660f23eeb00ebaeae8a063da'),
                questionBody : '¿En qué estadio juega el ',
                typeQuestion : 'equipo_estadio'
            },
            {
                _id : new ObjectId('660b2f7194122f3bb624acfc'),
                questionBody : '¿Cual es el autor del libro ',
                typeQuestion : 'libro_autor'
            },
            {
                _id : new ObjectId('660f22d7b00ebaeae8a063d9'),
                questionBody : '¿Cuál es la capacidad del estadio ',
                typeQuestion : 'estadio_capacidad'
            },
            {
                _id : new ObjectId('66118f4b9d6b53d719190541'),
                questionBody : '¿En que año nacio ',
                typeQuestion : 'cantante_anio'
            },
        ]);     

    } finally {
        await client.close(); // Cerrar la conexión con la base de datos
    }
}

module.exports = { insertTestData };
