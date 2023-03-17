const jwt = require('jsonwebtoken');
const jwtUtil = require('../../src/utility/jwt.util');

describe('JWT Util', () => { 
  describe('Sign Token', () => { 
    it('should return jwt token', async () => {
      jest.spyOn(jwt, 'sign').mockResolvedValue('jwt token');
      const result = await jwtUtil.signToken('payload');
      expect(result).toEqual('jwt token');
    });
  });

  describe('Verify Token', () => { 
    it('should return payload if jwt token is correct', async () => {
      jest.spyOn(jwt, 'verify').mockResolvedValue({ payload: 'payload' });
      const result = await jwtUtil.verifyToken('token');
      expect(result).toEqual({ payload: 'payload' });
    });
  });
});