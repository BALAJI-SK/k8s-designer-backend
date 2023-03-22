const httpError = require('../exceptions/user.exception');
const userRepositoryService = require('../repositories/user.repositories');
const passwordUtil = require('../utility/password.util');
const jwtUtil = require('../utility/jwt.util');


const createUser = async (name, email, password) => {
  const { hashpassword, salt } = await passwordUtil.hashPassword(password);
  const newUser = await userRepositoryService.createUser({ fullName: name, email, password: hashpassword, salt });
  if(!newUser) {
    // console.log(newUser);
    throw new httpError('Unable to create user', 400);
  }
  return {
    message: 'User Registered Succesfully',
  };
};

const loginUser = async (email, password) => {
  const existingUser = await userRepositoryService.getUserDetail(email);
  if(!existingUser) {
    throw new httpError('User doesnot exists', 400);
  }
  const checkPassword = await passwordUtil.comparePassword(password, existingUser.password);
  if(!checkPassword) {
    throw new httpError('Incorrect Password', 400);
  }
  const token = await jwtUtil.signToken({ id: existingUser.id, name: existingUser.name, email: existingUser.email });
  return `Bearer ${token}`;
};

const validateUser = async (token) => {
  const verifiedToken = await jwtUtil.verifyToken(token);
  if(!verifiedToken) {
    throw new httpError('Unauthorize User', 401);
  }
  return { message: 'Authorize User' };
};

module.exports = { createUser, loginUser, validateUser };