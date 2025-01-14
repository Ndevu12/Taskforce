
import Joi from 'joi';

export const validateSubCategoryInput = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    user: Joi.string().optional(),
    isDefault: Joi.boolean().optional()
  });

  return schema.validate(data);
};