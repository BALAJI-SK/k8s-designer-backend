const routes = require('express').Router();
const userControllers = require('../controllers/user.controller');
const { joiValidation } = require('../utility/joi.util');
const { emailSchema, createBodySchema, loginBodySchema } = require('../schemas/user.schema');

routes.post('/generate/otp', joiValidation(emailSchema), userControllers.generateOtp);
routes.post('/register', joiValidation(createBodySchema),userControllers.createUser);
routes.post('/login', joiValidation(loginBodySchema), userControllers.loginUser);
routes.get('/validate', userControllers.validateUser);

module.exports = routes;