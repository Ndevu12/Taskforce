import Joi from 'joi';
import { UserRole } from '../../types/enums/UserRole';

export const validateUserInput = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(...Object.values(UserRole)).required()
  });

  return schema.validate(data);
};
