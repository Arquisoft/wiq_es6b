const { MongoMemoryServer } = require('mongodb-memory-server');


let mongoserver;
let userservice;
let authservice;
let gatewayservice;
let createservice;
let recordservice;
let generatedquestservice;
let questiongeneratorservice;

async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    createservice = await require("../../questions/createservice/create-service");
    recordservice = await require("../../questions/recordservice/record-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
    rankingservice = await require("../../users/rankingservice/ranking-service");
    generatedquestservice = await require("../../questions/generatedquestservice/generatedquest-service");
    questiongeneratorservice = await require("../../questions/questiongeneratorservice/questiongenerator-service");
  }

  startServer();
