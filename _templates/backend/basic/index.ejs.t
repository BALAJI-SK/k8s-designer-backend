---
to: <%= outputPath %>/<%= name %>/index.js
force: true
---
const express = require('express');
const {routes, swGetDatabaseValue} =require('./src/routes/healthcheck.routes.js');

const app = express();
const PORT = process.env.PORT || <%= port %>;



const  swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerAutogen = require("swagger-autogen")();
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"];

<% if(frontends.length >0) {-%>
const cors = require('cors');
const corsOrigins = [
  <% frontends.map(frontend => { %>
  'http://<%= frontend.name + ':' + frontend.port %>',
  <% }); %>
];

app.use(cors({
  origin: corsOrigins,
}));
<%}-%>
const swaggerOptions =  {
  definition: {
    info: {
      title: 'LogRocket Express API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'LogRocket',
        url: 'https://logrocket.com',
        email: 'info@email.com',
      },
    
     
    },
    paths: {
      ...swGetDatabaseValue
    },  servers: [ {
      url: `http://localhost:${process.env.PORT}`,
      description: 'Development server'
    }],  
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'accessToken to access these guarded API endpoints',
        scheme: 'bearer',
      }
    },
  },
  apis: ['./src/routes/*.js'],
};
swaggerAutogen(outputFile, endpointsFiles, swaggerOptions);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);



const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {   explorer: true
  })
);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

