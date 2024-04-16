const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const Question = require('./create-model');

const app = express();
const port = 8005;

// Middleware para analizar JSON en el cuerpo de la solicitud
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://aswuser:aswuser@wiq06b.hsfgpcm.mongodb.net/questiondb?retryWrites=true&w=majority&appName=wiq06b';
mongoose.connect(mongoUri);

// Tipos de preguntas y consultas a Wikidata
const questionTypes = {
  pais_capital: {
    query: `
    SELECT ?country ?countryLabel ?capital ?capitalLabel
    WHERE {
      ?country wdt:P31 wd:Q6256.
      ?country wdt:P36 ?capital.
      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es".
      }
    }
    ORDER BY RAND()
    LIMIT 60
    `,
    questionLabel: 'countryLabel',
    answerLabel: 'capitalLabel'
  },
  pais_poblacion: {
    query: `
    SELECT DISTINCT ?countryLabel ?population
    {
      ?country wdt:P31 wd:Q6256 ;
              wdt:P1082 ?population .
      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es" 
      }
    }
    GROUP BY ?population ?countryLabel
    ORDER BY RAND()
    LIMIT 60
    `,
    questionLabel: 'countryLabel',
    answerLabel: 'population'
  },
  ciudad_pais: {
    query: `
      SELECT ?city ?cityLabel ?country ?countryLabel
      WHERE {
        ?city wdt:P31 wd:Q515.
        ?city wdt:P17 ?country.
        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es".
        }
      }
      ORDER BY RAND()
      LIMIT 30
    `,
    questionLabel: 'cityLabel',
    answerLabel: 'countryLabel'
  },
  pais_moneda: {
    query: `
      SELECT ?country ?countryLabel ?currency ?currencyLabel
      WHERE {
        ?currency wdt:P31 wd:Q8142.
        ?currency wdt:P17 ?country.
        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es".
        }
      }
      ORDER BY RAND()
      LIMIT 60
    `,
    questionLabel: 'countryLabel',
    answerLabel: 'currencyLabel'
  },
  libro_autor: {
    query: `
    SELECT DISTINCT ?libro ?libroLabel ?autor ?autorLabel
    WHERE {
      ?libro wdt:P31 wd:Q571;  # Q571 es el identificador para libro
             wdt:P50 ?autor.   # P50 es la propiedad para autor
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      ORDER BY RAND()
      LIMIT 35
    `,
    questionLabel: 'libroLabel',
    answerLabel: 'autorLabel'
  },
  libro_genero: {
    query: `
    SELECT DISTINCT ?libro ?libroLabel ?genero ?generoLabel
WHERE {
  ?libro wdt:P31 wd:Q571;   # Q571 es el identificador para libro
         wdt:P136 ?genero.  # P136 es la propiedad para género
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
}
      ORDER BY RAND()
      LIMIT 40
    `,
    questionLabel: 'libroLabel',
    answerLabel: 'generoLabel'
  },
  libro_anio: {
    query: `
    SELECT DISTINCT ?libro ?libroLabel ?anio_publicacion
    WHERE {
      ?libro wdt:P31 wd:Q571;                        # Q571 es el identificador para libro
             wdt:P577 ?fecha_publicacion.           # P577 es la propiedad para fecha de publicación
      BIND(YEAR(?fecha_publicacion) AS ?anio_publicacion)
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      ORDER BY RAND()
      LIMIT 30
    `,
    questionLabel: 'libroLabel',
    answerLabel: 'anio_publicacion'
  },
  montana_altura: {
    query: `
    SELECT DISTINCT ?montana ?montanaLabel ?altura
    WHERE {
      ?montana wdt:P31 wd:Q8502;  # Q8502 es el identificador para montaña
               wdt:P2044 ?altura. # P2044 es la propiedad para altura
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      LIMIT 30
    `,
    questionLabel: 'montanaLabel',
    answerLabel: 'altura'
  },
  cancion_cantante: {
    query: `
    SELECT DISTINCT ?cancion ?cancionLabel ?cantante ?cantanteLabel
    WHERE {
      ?cancion wdt:P31 wd:Q7366;  # Q7366 es el identificador para canción
               wdt:P175 ?cantante. # P175 es la propiedad para cantante
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      ORDER BY RAND()
      LIMIT 50
    `,
    questionLabel: 'cancionLabel',
    answerLabel: 'cantanteLabel'
  },
  cancion_album: {
    query: `
    SELECT DISTINCT ?cancion ?cancionLabel ?album ?albumLabel
    WHERE {
      ?cancion wdt:P31 wd:Q7366;  # Q7366 es el identificador para canción
               wdt:P361 ?album.    # P361 es la propiedad para álbum
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      ORDER BY RAND()
      LIMIT 30
    `,
    questionLabel: 'cancionLabel',
    answerLabel: 'albumLabel'
  },
  cancion_anio: {
    query: `
    SELECT DISTINCT ?cancion ?cancionLabel ?anio_publicacion
    WHERE {
      ?cancion wdt:P31 wd:Q7366;                        # Q7366 es el identificador para canción
               wdt:P577 ?fecha_publicacion.               # P577 es la propiedad para fecha de publicación
      BIND(YEAR(?fecha_publicacion) AS ?anio_publicacion)
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      ORDER BY RAND()
      LIMIT 35
    `,
    questionLabel: 'cancionLabel',
    answerLabel: 'anio_publicacion'
  },
  cantante_anio: {
    query: `
    SELECT ?cantante ?cantanteLabel ?anioNacimiento
      WHERE {
        ?cantante wdt:P106 wd:Q177220;         # Clase: cantante
                  wdt:P569 ?fechaNacimiento.  # Propiedad: fecha de nacimiento
        BIND(YEAR(?fechaNacimiento) AS ?anioNacimiento)
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
      }
      LIMIT 50
    `,
    questionLabel: 'cantanteLabel',
    answerLabel: 'anioNacimiento'
  },
  estadio_ciudad: {
    query: `
    SELECT DISTINCT ?estadio ?estadioLabel ?ciudad ?ciudadLabel
    WHERE {
      ?estadio wdt:P31 wd:Q483110;  # Q483110 es el identificador para estadio
               wdt:P131 ?ciudad.    # P131 es la propiedad para ciudad
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      ORDER BY RAND()
      LIMIT 50
    `,
    questionLabel: 'estadioLabel',
    answerLabel: 'ciudadLabel'
  },
  estadio_capacidad: {
    query: `
    SELECT DISTINCT ?estadio ?estadioLabel ?capacidad
    WHERE {
      ?estadio wdt:P31 wd:Q483110;  # Q483110 es el identificador para estadio
               wdt:P1083 ?capacidad. # P1083 es la propiedad para capacidad
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      ORDER BY RAND()
      LIMIT 60
    `,
    questionLabel: 'estadioLabel',
    answerLabel: 'capacidad'
  },
  equipo_estadio: {
    query: `
    SELECT DISTINCT ?equipo ?equipoLabel ?estadio ?estadioLabel
    WHERE {
      ?equipo wdt:P31 wd:Q476028;  # Q476028 es el identificador para equipo de fútbol
              wdt:P115 ?estadio.   # P115 es la propiedad para estadio
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      ORDER BY RAND()
      LIMIT 50
    `,
    questionLabel: 'equipoLabel',
    answerLabel: 'estadioLabel'
  },
  pais_idioma: {
    query: `
    SELECT DISTINCT ?countryLabel ?languageLabel
    WHERE {
      ?country wdt:P31 wd:Q6256;
               wdt:P37 ?language.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      ORDER BY RAND()
      LIMIT 60
    `,
    questionLabel: 'countryLabel',
    answerLabel: 'languageLabel'
  },
  equipo_deporte:{
    query: `
    SELECT ?equipo ?equipoLabel ?deporte ?deporteLabel
      WHERE {
        ?equipo wdt:P31 wd:Q4830453;    # Clase: equipo deportivo
                wdt:P641 ?deporte.      # Propiedad: deporte
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
      }
      ORDER BY RAND()
      LIMIT 50
    `,
    questionLabel: 'equipoLabel',
    answerLabel: 'deporteLabel'
  },

  equipo_anio:{
    query: `
    SELECT ?sportLabel (YEAR(?inception) as ?anioCreacion)
    WHERE {
      ?sport wdt:P31 wd:Q349;        # Clase: deporte
            wdt:P571 ?inception.    # Propiedad: fecha de creación
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }

      ORDER BY RAND()
      LIMIT 60
    `,
    questionLabel: 'sportLabel',
    answerLabel: 'inception'
  },

  deportista_anio:{
    query: `
    SELECT ?deportista ?deportistaLabel (YEAR(?inicioDeporte) as ?anioInicioDeporte)
    WHERE {
      ?deportista wdt:P106 wd:Q2066131;    # Clase: deportista
                  wdt:P2031 ?inicioDeporte. # Propiedad: año de inicio en el deporte
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      ORDER BY RAND()
      LIMIT 60
    `,
    questionLabel: 'deportistaLabel',
    answerLabel: 'inicioDeporte'
  },

  rio_pais:{
    query: `
    SELECT ?rioLabel ?paisLabel
    WHERE {
      ?rio wdt:P31 wd:Q4022;          # Clase: río
           wdt:P17 ?pais.            # Propiedad: país
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
      LIMIT 50
    `,
    questionLabel: 'rioLabel',
    answerLabel: 'paisLabel'
  },

  lago_pais: {
    query: `
    SELECT ?lagoLabel ?paisLabel
    WHERE {
      ?lago wdt:P31 wd:Q23397;   # Clase: lago
            wdt:P17 ?pais.      # Propiedad: país
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
    }
    
     LIMIT 70
    `,
    questionLabel: 'lagoLabel',
    answerLabel: 'paisLabel'

  },
  
};

// Ruta para agregar una nueva pregunta
app.post('/addQuestion', async (req, res) => {
  try {
    const newQuestion = new Question({
      questionBody: req.body.questionBody,
      typeQuestion: req.body.typeQuestion
    });
    await newQuestion.save();
    res.json(newQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
});

// Nuevo endpoint para obtener una pregunta completa
app.get('/getFullQuestion', async (req, res) => {
  try {
    const rQuestion = await Question.aggregate([{ $sample: { size: 1 } }]);
    const questionType = rQuestion[0].typeQuestion;
    const { query, questionLabel, answerLabel } = questionTypes[questionType];

    const apiUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`;
    const headers = { "Accept": "application/json" };
    const respuestaWikidata = await fetch(apiUrl, { headers });

    if (respuestaWikidata.ok) {
      const data = await respuestaWikidata.json();
      const numEles = data.results.bindings.length;

      let resultCorrecta;
      let informacionWikidata;
      let respuestaCorrecta;

      do {
        const indexCorrecta = Math.floor(Math.random() * numEles);
        resultCorrecta = data.results.bindings[indexCorrecta];
        informacionWikidata = resultCorrecta[questionLabel].value + '?';
        respuestaCorrecta = resultCorrecta[answerLabel].value;
      } while (informacionWikidata.startsWith('Q') || respuestaCorrecta.startsWith('Q') || respuestaCorrecta.startsWith('http')); // Solo se aceptan respuestas que no comienzan con 'Q'

      const respuestasFalsas = [];
      while (respuestasFalsas.length < 3) {
        const indexFalsa = Math.floor(Math.random() * numEles);
        const resultFalsa = data.results.bindings[indexFalsa];
        const respuestaFalsa = resultFalsa[answerLabel].value;

        // Comprueba si la respuesta falsa coincide con la respuesta correcta o con alguna de las respuestas falsas ya generadas
        if (respuestaFalsa !== respuestaCorrecta && !respuestasFalsas.includes(respuestaFalsa) && !respuestaFalsa.startsWith('Q')) { // Solo se aceptan respuestas que no comienzan con 'Q'
          respuestasFalsas.push(respuestaFalsa);
        }
      }

      const body = rQuestion[0].questionBody + informacionWikidata;

      const fullQuestion = {
        questionBody: body,
        correctAnswer: respuestaCorrecta,
        incorrectAnswers: respuestasFalsas, 
        typeQuestion: questionType
      };

      res.json(fullQuestion);
    } else {
      res.status(400).json({ error: "Error al realizar la consulta en Wikidata. Estado de respuesta:" + respuestaWikidata.status });
    }
  } catch (error) {
    res.status(400).json({ error: "Error al realizar la consulta en Wikidata." });
  }
});

// Iniciar el servidor
const server = app.listen(port, () => {
  console.log(`Servicio de autenticación escuchando en http://localhost:${port}`);
});

// Manejar el cierre del servidor
server.on('close', () => {
  // Cerrar la conexión de Mongoose
  mongoose.connection.close();
});

module.exports = server;
