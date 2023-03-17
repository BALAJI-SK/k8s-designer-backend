const express = require('express');
const routes =express();
const projectController= require('../controllers/project.controller');
const checkAuth = require('../middlewares/checkAuth.middleware');

routes.post('/projects',checkAuth,projectController.generateProjectController);

 
module.exports = routes;