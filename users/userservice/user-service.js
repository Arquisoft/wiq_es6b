// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('./user-model')
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')

require('dotenv').config();

const app = express();
app.disable("x-powered-by");
const port = 8001;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoUri = process.env.MONGODB_URI || `mongodb+srv://aswuser:${mongoPassword}@wiq06b.hsfgpcm.mongodb.net/userdb?retryWrites=true&w=majority&appName=wiq06b`;
mongoose.connect(mongoUri);

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
      if (!(field in req.body)) {
        throw new Error(`Missing required field: ${field}`);
      }
      if (req.body[field].trim() == '' || req.body[field] == null || typeof(req.body[field]) == undefined) {
        throw new Error(`Field ${field} must not be empty`);
      }
    }
}

app.post('/adduser', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['username', 'password']);

        // Siguiente comprobación: NO puede haber otro usuario en la BD con el mismo valor de username
        const username = req.body.username.toString();
        const existingUser = await User.findOne({ username });
        if(existingUser!=null){
            throw new Error(`The username "${req.body.username}" is already in use.`);
        }
        // Encrypt the password before saving it
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }});


    //obtiene todos los usuarios
    app.get('/getAllUsers', async (req, res) => {
      try {

          const users = await User.find();

          res.json(users);
      } catch (error) {
        
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });


// Read the OpenAPI YAML file synchronously
const openapiPath='./openapi.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server