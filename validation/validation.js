const Joi = require('joi');

// User registration validation schema
const registerValidation = (data) => {
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

// Login validation schema
const loginValidation = (data) => {
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

// Forgot password email validation
const forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email format',
      'any.required': 'Email is required'
    })
  });

  return schema.validate(data);
};

// OTP verification validation
const verifyOTPValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
      'any.required': 'OTP is required'
    })
  });

  return schema.validate(data);
};

// Reset password validation
const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(
      new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')
    ).required().messages({
      'string.pattern.base': 'Password must be at least 8 characters with at least 1 letter and 1 number',
      'any.required': 'Password is required'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required'
    })
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyOTPValidation,
  resetPasswordValidation
};