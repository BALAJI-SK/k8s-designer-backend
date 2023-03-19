const userService= require('../services/user.service');
const httpError = require('../exceptions/user.exception');
// const httpConstants = require('http2').constants;


const createUser = async (req, res) => { 
  try{
    const { name, email, password } = req.body;
    const result = await userService.createUser(name, email, password);
    res.status(201).json(result);
  } catch(err){
    if (err instanceof httpError) {
      res.status(err.status).json({ message: err.message });
      return;
    }
    res.status(500).json({ message: err.message});
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);
    res.status(200).json({
      token
    });
  } catch (error) {
    if(error instanceof httpError) {
      res.status(error.status).json({
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      message: error.message
    });
  }
};

const validateUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const result = await userService.validateUser(token);
    res.status(200).json(result);
  } catch (error) {
    if(error instanceof httpError){
      res.status(error.status).json({
        message: error.message
      });
      return;
    }
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { createUser, loginUser, validateUser };
