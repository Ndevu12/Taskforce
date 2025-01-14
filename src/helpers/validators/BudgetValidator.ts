import Joi from 'joi';

export const validateBudgetInput = (data: any) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    category: Joi.string().required(),
    amount: Joi.number().required(),
    period: Joi.string().valid('MONTHLY', 'YEARLY').required(),
    startDate: Joi.date().required(),
    currentSpent: Joi.number().optional(),
    notificationThreshold: Joi.number().optional()
  });

  return schema.validate(data);
};
