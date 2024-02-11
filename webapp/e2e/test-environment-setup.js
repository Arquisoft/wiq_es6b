const { MongoMemoryServer } = require('mongodb-memory-server');


let mongoserver;
let userservice;
let authservice;
let gatewayservice;
let createservice;
let answerservice;

async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    createservice = await require("../../questions/createservice/create-service");
    answerservice = await require("../../questions/answerservice/answer-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
  }

  startServer();
