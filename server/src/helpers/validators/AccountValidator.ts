import Joi from 'joi';
import { AccountType } from '../../types/enums/AccountType';

export const validateAccountInput = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    type: Joi.string().valid(...Object.values(AccountType)).required(),
    balance: Joi.number().min(0).optional(),
    currency: Joi.string().default('USD').optional(),
    isActive: Joi.boolean().optional(),
    accountNumber: Joi.when('type', {
      is: Joi.valid(AccountType.BANK, AccountType.MOBILE_MONEY),
      then: Joi.string().required(),
      otherwise: Joi.string().optional()
    })
  });

  return schema.validate(data);
};
