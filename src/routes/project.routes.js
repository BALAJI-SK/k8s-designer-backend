const express = require('express');
const routes =express();
const projectController= require('../controllers/project.controller');
const checkAuth = require('../middlewares/checkAuth.middleware');

routes.post('/',checkAuth,projectController.generateProjectController);
routes.get('/latest',checkAuth,projectController.getLatestProjectController);
 
module.exports = routes;