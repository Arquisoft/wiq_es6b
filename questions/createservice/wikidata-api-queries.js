/**
 * CLASE AUXILIAR PARA CREAR PREGUNTAS USANDO LA API DE WIKIDATA
 */

class QuestionQueries
{    
    constructor()
    {
        // Formato de la consulta a la API de Wikidata (QID concreto)
        this.wikidata_url = "https://www.wikidata.org/wiki/Special:EntityData/{qid}.json";
    }
    
    /**
     * Selecciona una plantilla de pregunta aleatoria,
     * la rellena haciendo una consulta a Wikidata
     * y la devuelve en un objeto JSON.
     * 
     * El objeto JSON devuelto tiene el siguiente formato:
     * ```
     * {
     *  question : "<pregunta>",
     *  correct_answer : "<respuesta correcta>",
     *  distractors : ["<incorrecta 1>","<incorrecta 2>","<incorrecta 3>"]
     * }
     * ```
     * 
     * @returns Objeto JSON con información de la pregunta
     */
    async generateRandomQuestion()
    {
        // Array de preguntas
        // Se seleccionará uno de forma aleatoria
        var questionFunctions=
        [
            // Países
                // Continente
                // Población
                // Capital

            // Elementos químicos
            () => this.generateChemElementSymbolQuestion(), // Símbolo
            () => this.generateChemElementNameQuestion()    // Nombre
        ];

        // Selecciona una al azar y la ejecuta
        var questionIndex = Math.floor(Math.random() * questionFunctions.length);
        var questionData = await questionFunctions[questionIndex]();

        return questionData;
    }

    /* -- FUNCIONES PARA GENERAR PREGUNTAS -- */

    /**
     * Genera una pregunta aleatoria sobre el nombre
     * de un elemento químico, con el enunciado
     * de la pregunta, la respuesta correcta y otras
     * 3 distractoras.
     * 
     * @returns Objeto JSON conteniendo la información.
     */
    async generateChemElementNameQuestion()
    {
        // Plantillas de preguntas
        var templates =
        [
            "El elemento químico que tiene por símbolo ___ es..."
        ]

        // Se elige una plantilla
        var len = templates.length;
        var qTemplate = templates[Math.floor(Math.random() * len)];
        
        //  JSON con la información de la pregunta
        var result =
        {
            question : "",
            correct_answer : "",
            distractors : ["", "", ""]
        }


            // 1) Obtener entidad al azar
        var qid = await this.searchRandomChemElem();

            // 2) Obtener símbolo y nombre de la entidad escogida
        var elemName = await this.queryChemElemName(qid);
        var elemSymbol = await this.queryChemElemSymbol(qid);

            // 3) Obtener otros símbolos (distractores)
        var distractors = await this.generateChemElemNameDistractors(qid);

            // 4) Recopilar info
        result.question = qTemplate.replace("___", elemSymbol);
        result.correct_answer = elemName;
        for (var i = 0; i < 3; i++)
            result.distractors[i] = distractors[i];

        return result;
    }

    /**
     * Genera una pregunta aleatoria sobre el símbolo
     * de un elemento químico, con el enunciado
     * de la pregunta, la respuesta correcta y otras
     * 3 distractoras.
     * 
     * @returns Objeto JSON conteniendo la información.
     */
    async generateChemElementSymbolQuestion()
    {
        // Plantillas de preguntas
        var templates =
        [
            "¿Cuál es el símbolo químico del ___?",
            "El símbolo químico del ___ es..."
        ]

        // Se elige una plantilla
        var len = templates.length;
        var qTemplate = templates[Math.floor(Math.random() * len)];
        
        //  JSON con la información de la pregunta
        var result =
        {
            question : "",
            correct_answer : "",
            distractors : ["", "", ""]
        }


            // 1) Obtener entidad al azar
        var qid = await this.searchRandomChemElem();

            // 2) Obtener símbolo y nombre de la entidad escogida
        var elemName = await this.queryChemElemName(qid);
        var elemSymbol = await this.queryChemElemSymbol(qid);

            // 3) Obtener otros símbolos (distractores)
        var distractors = await this.generateChemElemSymbolDistractors(qid);

            // 4) Recopilar info
        result.question = qTemplate.replace("___", elemName);
        result.correct_answer = elemSymbol;
        for (var i = 0; i < 3; i++)
            result.distractors[i] = distractors[i];

        return result;
    }

    async generateCountryCapitalQuestion()
    {
        // Plantillas de preguntas
        var templates =
        [
            "¿Cuál es la capital de ___?",
            "La capital de ___ es..."
        ]

        // Se elige una plantilla
        var len = templates.length;
        var qTemplate = templates[Math.floor(Math.random() * len)];
        
        //  JSON con la información de la pregunta
        var result =
        {
            question : "",
            correct_answer : "",
            distractors : ["", "", ""]
        }

            // 1) Obtener entidad al azar
        var qid = await this.searchRandomCountry();

            // 2) Obtener nombre y capital de la entidad escogida
        var name = await this.queryCountryName(qid);
        var capital = await this.queryCountryCapital(qid);

            // 3) Obtener otros símbolos (distractores)
        var distractors = await this.generateCountryCapitalDistractors(qid);

            // 4) Recopilar info
        result.question = qTemplate.replace("___", name);
        result.correct_answer = capital;
        for (var i = 0; i < 3; i++)
            result.distractors[i] = distractors[i];

        return result;
    }

    async generateCountryPopulationQuestion()
    {
        // Plantillas de preguntas
        var templates =
        [
            "¿Cuál es la población de ___?",
            "¿Cuánta gente vive en ___?",
            "La población total de ___ es..."
        ]

        // Se elige una plantilla
        var len = templates.length;
        var qTemplate = templates[Math.floor(Math.random() * len)];
        
        //  JSON con la información de la pregunta
        var result =
        {
            question : "",
            correct_answer : "",
            distractors : ["", "", ""]
        }

            // 1) Obtener entidad al azar
        var qid = await this.searchRandomCountry();

            // 2) Obtener nombre y capital de la entidad escogida
        var name = await this.queryCountryName(qid);
        var population = await this.queryCountryPopulation(qid);

            // 3) Obtener otros símbolos (distractores)
        var distractors = await this.generateCountryPopulationDistractors(qid);

            // 4) Recopilar info
        result.question = qTemplate.replace("___", name);
        result.correct_answer = population;
        for (var i = 0; i < 3; i++)
            result.distractors[i] = distractors[i];

        return result;
    }

    async generateCountryContinentQuestion()
    {
        // Plantillas de preguntas
        var templates =
        [
            "¿En qué continente se encuentra ___?"
        ]

        // Se elige una plantilla
        var len = templates.length;
        var qTemplate = templates[Math.floor(Math.random() * len)];
        
        //  JSON con la información de la pregunta
        var result =
        {
            question : "",
            correct_answer : "",
            distractors : ["", "", ""]
        }

            // 1) Obtener entidad al azar
        var qid = await this.searchRandomCountry();

            // 2) Obtener nombre y capital de la entidad escogida
        var name = await this.queryCountryName(qid);
        var continent = await this.queryCountryContinent(qid);

            // 3) Obtener otros símbolos (distractores)
        var distractors = await this.generateCountryContinentDistractors(qid);

            // 4) Recopilar info
        result.question = qTemplate.replace("___", name);
        result.correct_answer = continent;
        for (var i = 0; i < 3; i++)
            result.distractors[i] = distractors[i];

        return result;
    }

    /* -- FUNCIONES PARA OBTENER ENTIDADES ALEATORIAS */

    /**
     * Busca mediante la API de Wikidata un elemento químico aleatorio.
     * Devolviendo su QID para futuras consultas.
     * 
     * @returns JSON con la info. del elemento.
     */
    async searchRandomChemElem()
    {
        // Consulta SPARQL
        var endpointUrl = 'https://query.wikidata.org/sparql';
        var sparqlQuery = `
            SELECT DISTINCT ?item WHERE {
                ?item p:P246 ?statement0.
                ?statement0 (ps:P246) _:anyValueP246.
                ?item p:P31 ?statement1.
                ?statement1 (ps:P31/(wdt:P279*)) wd:Q11344.
                ?item p:P1086 ?statement2.
                ?statement2 (psv:P1086/wikibase:quantityAmount) ?numericQuantity.
            }
            ORDER BY SUBSTR(str(?item), STRLEN(str(?item)) - 4)
            LIMIT 20
        `;
        
        try
        {
            var response = await fetch(endpointUrl,
            {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/sparql-results+json'
                },
                body: new URLSearchParams({
                  query: sparqlQuery
                })
              });
    
            if (!response.ok)
            {
                throw new Error('Failed to execute SPARQL query');
            }
    
            const data = await response.json();

            // 2) Obtener QID de una entidad
    
            var i = Math.floor(Math.random() * 10); // Coge uno al azar
            var elemQID = data.results.bindings[i].item.value.substring(31);

            return elemQID;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Busca mediante la API de Wikidata un país aleatorio.
     * Devolviendo su QID para futuras consultas.
     * 
     * @returns JSON con la info. del país.
     */
    async searchRandomCountry()
    {
        // Consulta SPARQL
        var endpointUrl = 'https://query.wikidata.org/sparql';
        var sparqlQuery = `
            SELECT DISTINCT ?item WHERE {
                ?item p:P31 ?statement0.
                ?statement0 (ps:P31/(wdt:P279*)) wd:Q6256.
                ?item p:P30 ?statement1.
                ?statement1 (ps:P30/(wdt:P279*)) _:anyValueP30.
                ?item p:P36 ?statement2.
                ?statement2 (ps:P36/(wdt:P279*)) _:anyValueP36.
                ?item p:P1082 ?statement3.
                ?statement3 (psv:P1082/wikibase:quantityAmount) ?numericQuantity.
            }
            ORDER BY SUBSTR(str(?item), STRLEN(str(?item)) - 4)
            LIMIT 20
        `;
        
        try
        {
            var response = await fetch(endpointUrl,
            {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/sparql-results+json'
                },
                body: new URLSearchParams({
                  query: sparqlQuery
                })
              });
    
            if (!response.ok)
            {
                throw new Error('Failed to execute SPARQL query');
            }
    
            const data = await response.json();

            // 2) Obtener QID de una entidad
    
            var i = Math.floor(Math.random() * 20); // Coge uno al azar
            var countryQID = data.results.bindings[i].item.value.substring(31);

            return countryQID;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /* -- FUNCIONES PARA GENERAR LA RESPUESTA CORRECTA --*/

    /**
     * Obtiene el símbolo del elemento químico con el QID especificado.
     * 
     * @param {String} qid ID de Wikidata
     * 
     * @returns {String} Símbolo del elemento
     * 
     * @example
     * var symbol = queryChemElemSymbol("Q560");
     * console.log(symbol); // "C"
     */
    async queryChemElemSymbol(qid)
    {
        try
        {
            var queryUrl = this.wikidata_url.replace("{qid}",qid);
            var response = await fetch(queryUrl);

            if (response.ok)
            {
                var data = await response.json();
                var entity = data.entities[qid];

                // Devuelve el símbolo del elemento
                return entity.claims["P246"][0].mainsnak.datavalue.value;
            }
            else
            {
                console.error("Se ha producido un error intentando recuperar datos de la entidad: " + qid);
            }
        }
        catch (error)
        {
            console.error("Ocurrió un error: " + error);
        }
    }

    /**
     * Obtiene el nombre del elemento químico con el QID especificado.
     * 
     * @param {String} qid ID de Wikidata
     * 
     * @returns {String} Nombre del elemento
     * 
     * @example
     * var symbol = queryChemElemName("Q560");
     * console.log(symbol); // "carbono"
     */
    async queryChemElemName(qid)
    {
        try
        {
            var queryUrl = this.wikidata_url.replace("{qid}",qid);
            var response = await fetch(queryUrl);

            if (response.ok)
            {
                var data = await response.json();
                var entity = data.entities[qid];

                // Devuelve el nombre del elemento en español
                return entity.labels.es.value;
            }
            else
            {
                console.error("Se ha producido un error intentando recuperar datos de la entidad: " + qid);
            }
        }
        catch (error)
        {
            console.error("Ocurrió un error: " + error);
        }
    }

    async queryCountryName(qid)
    {
        // TODO: Implementar
        console.error("Sin implementar");
    }

    async queryCountryPopulation(qid)
    {
        // TODO: Implementar
        console.error("Sin implementar");
    }

    async queryCountryCapital(qid)
    {
        // TODO: Implementar
        console.error("Sin implementar");
    }

    async queryCountryContinent(qid)
    {
        // TODO: Implementar
        console.error("Sin implementar");
    }

    /* -- FUNCIONES PARA OBTENER DISTRACTORES -- */

    /**
     * Devuelve 3 respuestas distractoras dependientes de una correcta,
     * dado el QID de esta última.
     * Estas distractoras serán símbolos de elementos químicos.
     * 
     * @param {String} qid ID de Wikidata del elemento químico
     * 
     * @returns Array de 3 distractores
     */
    async generateChemElemSymbolDistractors(qid)
    {
        var distractors = ["", "", ""];

        var wrongQids = [qid, qid, qid];

        // 1) Buscar 3 elementos aleatorios (distintos al correcto)
        for (var i = 0; i < 3; i++)
        {
            do
            {
                wrongQids[i] = await this.searchRandomChemElem();
            
                // Evitar duplicados entre los 2 primeros
                if (i === 1 && wrongQids[1] === wrongQids[0]) continue;
            
                // Evitar duplicados entre los 3
                if (i === 2 && (wrongQids[2] === wrongQids[0] || wrongQids[2] === wrongQids[1])) continue;
            
                // Evitar que el elemento coincida con qid
                if (wrongQids[i] === qid) continue;
            
                // Incrementar i solo si no hay duplicados ni coincidencias con qid
                i++;
            } while (i < 3);
        }

        // 2) Buscar símbolo de los 3 distractores
        for (var i = 0; i < 3; i++)
        {
            distractors[i] = await this.queryChemElemSymbol(wrongQids[i]);
        }

        return distractors;
    }

    /**
     * Devuelve 3 respuestas distractoras dependientes de una correcta,
     * dado el QID de esta última.
     * Estas distractoras serán nombres de elementos químicos.
     * 
     * @param {String} qid ID de Wikidata del elemento químico
     * 
     * @returns Array de 3 distractores
     */
    async generateChemElemNameDistractors(qid)
    {
        var distractors = ["", "", ""];

        var wrongQids = [qid, qid, qid];

        // 1) Buscar 3 elementos aleatorios (distintos al correcto)
        for (var i = 0; i < 3; i++)
        {
            do
            {
                wrongQids[i] = await this.searchRandomChemElem();
            
                // Evitar duplicados entre los 2 primeros
                if (i === 1 && wrongQids[1] === wrongQids[0]) continue;
            
                // Evitar duplicados entre los 3
                if (i === 2 && (wrongQids[2] === wrongQids[0] || wrongQids[2] === wrongQids[1])) continue;
            
                // Evitar que el elemento coincida con qid
                if (wrongQids[i] === qid) continue;
            
                // Incrementar i solo si no hay duplicados ni coincidencias con qid
                i++;
            } while (i < 3);
        }

        // 2) Buscar nombre de los 3 distractores
        for (var i = 0; i < 3; i++)
        {
            distractors[i] = await this.queryChemElemName(wrongQids[i]);
        }

        return distractors;
    }



}

