const Joi = require('joi');

// Category validation schema
const categoryValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Category name is required',
      'string.empty': 'Category name cannot be empty'
    })
  });

  return schema.validate(data);
};

module.exports = {
  categoryValidation
};