
import Joi from 'joi';

export const validateUserUpdateInput = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().optional(),
    name: Joi.string().min(3).max(30).optional(),
    password: Joi.string().min(6).optional()
  });

  return schema.validate(data);
};