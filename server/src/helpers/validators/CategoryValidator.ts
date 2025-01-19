import Joi from 'joi';

export const validateCategoryInput = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  return schema.validate(data);
};

export const validateCategoryUpdateInput = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });

  return schema.validate(data);
};
