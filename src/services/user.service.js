const httpError = require('../exceptions/user.exception');
const userRepositoryService = require('../repositories/user.repositories');
const passwordUtil = require('../utility/password.util');
const jwtUtil = require('../utility/jwt.util');
const otpUtil = require('../utility/otp.util');

const generateOtp = async (email) => {
  try{
    const doesUserExist = await userRepositoryService.doesUserExist(email);
    if(doesUserExist) {
      throw new httpError('User already exists', 400);
    }
    const otp = await otpUtil.sendOtp(email);
    return {
      message: 'OTP sent successfully',
      otp,
    };
  }catch(error){
    throw new httpError('some problem with the email', 404);
  }
};

const saveOtp = async (email, otp) => {
  await userRepositoryService.deleteOtp(email);
  await userRepositoryService.saveOtp(email, otp);
};


const createUser = async (name, email, otp, password) => {
  const otpfromDB = await userRepositoryService.getOtp(email);
  // console.log(otpfromDB);
  if(otpfromDB[0].otp !== otp) {
    throw new httpError('Incorrect OTP', 400);
  }
  // console.log(otpfromDB[0].timestamp, new Date(Date.now()-1*60*1000));
  if(otpfromDB[0].timestamp < new Date(Date.now()- process.env.OTP_EXPIRY_TIME)) {
    throw new httpError('OTP Expired', 400);
  }
  await userRepositoryService.deleteOtp(email);
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

module.exports = { generateOtp, saveOtp, createUser, loginUser, validateUser };
