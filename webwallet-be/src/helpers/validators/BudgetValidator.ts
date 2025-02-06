import Joi from 'joi';
import { BudgetPeriod } from '../../types/enums/BudgetPeriod';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const validateBudgetInput = (data: any) => {
  const schema = Joi.object({
    category: objectId.required(),
    amount: Joi.number().required(),
    period: Joi.string().valid(...Object.values(BudgetPeriod)).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    currentSpent: Joi.number().optional(),
    notificationThreshold: Joi.number().optional(),
    description: Joi.string().optional()
  });

  return schema.validate(data);
};

export const validateBudgetUpdateInput = (data: any) => {
  const schema = Joi.object({
    category: objectId.optional(),
    amount: Joi.number().optional(),
    period: Joi.string().valid(...Object.values(BudgetPeriod)).optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    currentSpent: Joi.number().optional(),
    notificationThreshold: Joi.number().optional(),
    description: Joi.string().optional() // New validation
  });

  return schema.validate(data);
};
