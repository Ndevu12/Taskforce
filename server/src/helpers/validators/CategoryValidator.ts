import Joi from 'joi';

export const validateCategoryInput = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('INCOME', 'EXPENSE').required(),
    isDefault: Joi.boolean().optional()
  });

  return schema.validate(data);
};

export const validateCategoryUpdateInput = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    userId: Joi.string().optional()
  });

  return schema.validate(data);
};
