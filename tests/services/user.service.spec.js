const userService = require('../../src/services/user.service');
const passwordUtil = require('../../src/utility/password.util');
const jwtUtil = require('../../src/utility/jwt.util');
const userRepositoryService = require('../../src/repositories/user.repositories');

describe('User Service', () => { 
  describe('Create User', () => { 
    it('should create a new user', async () => {
      jest.spyOn(userRepositoryService, 'getOtp').mockResolvedValue([{'otp': '1234', 'timestamp': new Date(Date.now()-1*60*1000)}]);
      jest.spyOn(userRepositoryService, 'deleteOtp').mockResolvedValue(null);
      jest.spyOn(passwordUtil, 'hashPassword').mockResolvedValue('hashedpassword');
      jest.spyOn(userRepositoryService, 'createUser').mockResolvedValue({ id: 1, name: 'name', email: 'email', password: 'hashedpassword' });
      const result = await userService.createUser('name', 'email', '1234', 'password');
      expect(result).toEqual({ message: 'User Registered Succesfully' });
    });
    it('should throw custom error', async () => {
      jest.spyOn(userRepositoryService, 'getOtp').mockResolvedValue([{'otp': '1234', 'timestamp': new Date(Date.now()-1*60*1000)}]);
      jest.spyOn(userRepositoryService, 'deleteOtp').mockResolvedValue(null);
      jest.spyOn(passwordUtil, 'hashPassword').mockResolvedValue('hashedpassword');
      jest.spyOn(userRepositoryService, 'createUser').mockResolvedValue(null);
      expect(userService.createUser('name', 'email', '1234', 'password')).rejects.toThrow('Unable to create user');
    });
  });

  describe('Login User', () => { 
    it('should login user', async () => {
      jest.spyOn(userRepositoryService, 'getUserDetail').mockResolvedValue({ id: 1, name: 'name', email: 'email', password: 'hashedpassword' });
      jest.spyOn(passwordUtil, 'comparePassword').mockResolvedValue(true);
      jest.spyOn(jwtUtil, 'signToken').mockResolvedValue('token');
      const result = await userService.loginUser('email', 'password');
      expect(result).toEqual('Bearer token');
    });
    it('should throw custom error when user doesnot exists', async () => {
      jest.spyOn(userRepositoryService, 'getUserDetail').mockResolvedValue(false);
      expect(userService.loginUser('name', 'email', 'password')).rejects.toThrow('User doesnot exists');
    });
    it('should throw custom error when user enters wrong password', async () => {
      jest.spyOn(userRepositoryService, 'getUserDetail').mockResolvedValue(true);
      jest.spyOn(passwordUtil, 'comparePassword').mockResolvedValue(false);
      expect(userService.loginUser('name', 'email', 'password')).rejects.toThrow('Incorrect Password');
    });
  });

  describe('Validate User', () => { 
    it('should validate user', async () => {
      jest.spyOn(jwtUtil, 'verifyToken').mockResolvedValue('token');
      const result = await userService.validateUser('email', 'password');
      expect(result).toEqual({ message: 'Authorize User' });
    });
    it('should throw custom error when user is not valid', async () => {
      jest.spyOn(jwtUtil, 'verifyToken').mockResolvedValue(false);
      expect(userService.validateUser('name', 'email', 'password')).rejects.toThrow('Unauthorize User');
    });
  });
});