const jwt = require('jsonwebtoken');
const http2constants = require('http2').constants;
require('dotenv').config();
const checkAuth = require('../../src/middlewares/checkAuth.middleware');

describe('checkAuth middleware', () => {
  let req, res, next ,decoded;
  beforeEach(() => {
    req = {
      headers: {
        authorization:
          'Bearer ' +
          jwt.sign({ userId: '123' }, 'mysecret', {
            expiresIn: '1h',
          }),
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'mysecret');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set req.userData if valid token is provided', async() => {
    jest.spyOn(jwt, 'verify').mockReturnValue(decoded);
    await checkAuth(req, res, next);
    // console.log(req.headers.authorization+ " " + "req.headers.authorization");
    // console.log(req.userData.userId+ " " + "req.userData.userId")
    expect(req.userData).toBeDefined();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', () => {
    req.headers.authorization = undefined;
    checkAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(
      http2constants.HTTP_STATUS_UNAUTHORIZED
    );
    expect(res.json).toHaveBeenCalledWith({ message: 'Auth failed' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    checkAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(
      http2constants.HTTP_STATUS_UNAUTHORIZED
    );
    expect(res.json).toHaveBeenCalledWith({ message: 'Auth failed' });
    expect(next).not.toHaveBeenCalled();
  });
});