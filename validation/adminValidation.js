const Joi = require('joi');

// Admin registration validation schema
const adminRegisterValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required().messages({
      'string.min': 'Username must be at least 3 characters long',
      'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email format',
      'any.required': 'Email is required'
    }),
    password: Joi.string().pattern(
      new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')
    ).required().messages({
      'string.pattern.base': 'Password must be at least 8 characters with at least 1 letter and 1 number',
      'any.required': 'Password is required'
    })
  });

  return schema.validate(data);
};

// Admin login validation schema
const adminLoginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email format',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  });

  return schema.validate(data);
};

module.exports = {
  adminRegisterValidation,
  adminLoginValidation
};