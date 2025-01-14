import Joi from 'joi';

export const validateAccountInput = (data: any) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    name: Joi.string().min(3).max(30).required(),
    type: Joi.string().valid('BANK', 'MOBILE_MONEY', 'CASH').required(),
    balance: Joi.number().min(0).optional(),
    currency: Joi.string().default('USD').optional(),
    isActive: Joi.boolean().optional()
  });

  return schema.validate(data);
};
