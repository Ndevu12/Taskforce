import Joi from 'joi';

export const validateTransactionInput = (data: any) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    account: Joi.string().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().optional(),
    type: Joi.string().valid('INCOME', 'EXPENSE').required(),
    amount: Joi.number().required(),
    description: Joi.string().optional(),
    date: Joi.date().optional()
  });

  return schema.validate(data);
};
