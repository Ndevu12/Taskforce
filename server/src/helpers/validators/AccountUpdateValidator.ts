import Joi from 'joi';
import { AccountType } from '../../types/enums/AccountType';

export const validateAccountUpdateInput = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    type: Joi.string().valid(...Object.values(AccountType)).optional(),
    balance: Joi.number().min(0).optional(),
    currency: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    accountNumber: Joi.when('type', {
      is: Joi.valid(AccountType.BANK, AccountType.MOBILE_MONEY),
      then: Joi.string().required(),
      otherwise: Joi.string().optional()
    })
  });

  return schema.validate(data);
};
