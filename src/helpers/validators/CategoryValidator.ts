import Joi from 'joi';

export const validateCategoryInput = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('INCOME', 'EXPENSE').required(),
    user: Joi.string().required(),
    isDefault: Joi.boolean().optional()
  });

  return schema.validate(data);
};
