const { joiValidation } = require('../../src/utility/joi.util.js');
const Joi = require('joi');

describe('joiValidation', () => {
  it('should return 400 error response for invalid request body', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    const req = {
      body: {
        name: 'John Doe',
        email: 'invalidemail.com',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    joiValidation(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        '"email" must be a valid email',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next middleware for valid request body', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    const req = {
      body: {
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
    };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    const next = jest.fn();

    joiValidation(schema)(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
