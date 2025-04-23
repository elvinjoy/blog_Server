const Joi = require('joi');

const blogValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().messages({
      'any.required': 'Title is required',
    }),
    description: Joi.string().required().messages({
      'any.required': 'Description is required',
    }),
    category: Joi.string().required().messages({
      'any.required': 'Category is required',
    }),
    // No images validation here because files come separately
  });

  return schema.validate(data);
};

module.exports = blogValidation;
