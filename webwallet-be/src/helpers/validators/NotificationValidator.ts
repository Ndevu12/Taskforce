import Joi from 'joi';

export const validateNotificationInput = (data: any) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    type: Joi.string().valid('BUDGET_THRESHOLD', 'TRANSACTION_ALERT').required(),
    message: Joi.string().required(),
    read: Joi.boolean().optional()
  });

  return schema.validate(data);
};

export const validateNotificationUpdateInput = (data: any) => {
  const schema = Joi.object({
    type: Joi.string().valid('BUDGET_THRESHOLD', 'TRANSACTION_ALERT').optional(),
    message: Joi.string().optional(),
    read: Joi.boolean().optional()
  });

  return schema.validate(data);
};
