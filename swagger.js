const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Member API',
        description: 'Members and Users API'
    },
    host: 'localhost:3001',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js']

swaggerAutogen(outputFile, endpointFiles, doc);