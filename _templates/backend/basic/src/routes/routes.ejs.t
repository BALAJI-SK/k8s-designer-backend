---
to: <%= outputPath %>/<%= name %>/src/routes/healthcheck.routes.js
force: true
---
const routes = require('express').Router();
const controllers = require('../controllers/healthcheck.controllers.js');

routes.route('/')
  .get(controllers.healthCheck);
routes.route('/ping')
  .get(controllers.getDetails);

module.exports = routes;