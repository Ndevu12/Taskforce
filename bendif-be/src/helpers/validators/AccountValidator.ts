import Joi from 'joi';
import { AccountType } from '../../types/enums/AccountType';

export const validateAccountInput = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    type: Joi.string().valid(...Object.values(AccountType)).required(),
    balance: Joi.number().min(0).optional(),
    currency: Joi.string().default('FRW').optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};
