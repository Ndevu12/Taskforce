import Joi from 'joi';

export const validateTransactionInput = (transactionData: any) => {
  const schema = Joi.object({
    account: Joi.string().required().messages({
      'string.empty': 'Account is required',
    }),
    category: Joi.string().required().messages({
      'string.empty': 'Category is required',
    }),
    amount: Joi.number().required().positive().messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be positive',
      'any.required': 'Amount is required',
    }),
    description: Joi.string().allow('').optional(),
    date: Joi.date().required().messages({
      'date.base': 'Date must be a valid date',
      'any.required': 'Date is required',
    }),
    budget: Joi.string().allow(null, '').optional(),
    subCategory: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(transactionData);
};

export const validateTransactionUpdateInput = (transactionData: any) => {
  const schema = Joi.object({
    account: Joi.string().optional(),
    category: Joi.string().optional(),
    amount: Joi.number().positive().optional(),
    description: Joi.string().allow('').optional(),
    date: Joi.date().optional(),
    budget: Joi.string().allow(null, '').optional(),
    subCategory: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(transactionData);
};
