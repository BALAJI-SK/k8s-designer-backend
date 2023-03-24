const Joi = require('joi');

const emailSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required()
});
const userSchema = Joi.object({
  user_id: Joi.number()
});

const createBodySchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  otp: Joi.string().required(),
  password: Joi.string().min(3).max(12).required()
});

const loginBodySchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(3).max(12).required(),
});

module.exports = { emailSchema, createBodySchema, loginBodySchema, userSchema };