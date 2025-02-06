import Joi from 'joi';

export const validateTransactionInput = (data: any) => {
  const schema = Joi.object({
    account: Joi.string().required(),
    category: Joi.string().required(),
    type: Joi.string().valid('INCOME', 'EXPENSE').required(),
    amount: Joi.number().required(),
    description: Joi.string().optional(),
    date: Joi.date().optional(),
    subCategory: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional()
  });

  return schema.validate(data);
};

export const validateTransactionUpdateInput = (data: any) => {
  const schema = Joi.object({
    account: Joi.string().optional(),
    category: Joi.string().optional(),
    type: Joi.string().valid('INCOME', 'EXPENSE').optional(),
    amount: Joi.number().optional(),
    description: Joi.string().optional(),
    date: Joi.date().optional(),
    subCategory: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional()
  });

  return schema.validate(data);
};
