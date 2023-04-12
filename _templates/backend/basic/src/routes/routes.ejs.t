---
to: <%= outputPath %>/<%= name %>/src/routes/healthcheck.routes.js
force: true
---
const routes = require('express').Router();
const controllers = require('../controllers/healthcheck.controllers.js');
const j2s = require('joi-to-swagger');
const swGetDatabaseValue = {
  '/api/' : {
    'get': {
      ...controllers.swPing
    }
  },
  '/api/ping': {
    'get': {
      ...controllers.swGetDatabaseValue
    }
  }
};
routes.route('/')
  .get(controllers.healthCheck);
routes.route('/ping')
  .get(controllers.getDetails);

module.exports = {routes,swGetDatabaseValue};