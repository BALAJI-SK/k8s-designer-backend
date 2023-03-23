const httpError = require('../exceptions/user.exception');
const prisma = require('../config/prisma.config');

const saveOtp = async (email, otp) => {
  return prisma.otps.create({
    data: {
      email,
      otp,
    },
  });
};
const deleteOtp = async (email) => {
  return prisma.otps.deleteMany({
    where: {
      email: email,
    },
  });
};
const getOtp = async (email) => {
  return await prisma.otps.findMany({
    where: {
      email: email,
    },
  });
};

const createUser = async (data)=>{
  try{
    const newUser = await prisma.user.create({ data });
    return newUser;
  }catch(error){
    console.log(error);
    throw new httpError(`User with email ${data.email} already exists`, 400);
  }
};

const doesUserExist = async (email) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: email } });
    if(existingUser) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

const getUserDetail = async (email) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: email } });
    return existingUser;
  } catch (error) {
    console.log(error);
    throw new httpError('Error in Login', 400);
  }
};


module.exports = { saveOtp, deleteOtp,getOtp, createUser, getUserDetail, doesUserExist }; 