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

export const validateSubCategoryUpdateInput = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    category: Joi.string().optional(),
    user: Joi.string().optional(),
    isDefault: Joi.boolean().optional()
  });

  return schema.validate(data);
};