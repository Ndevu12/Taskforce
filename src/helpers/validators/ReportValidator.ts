import Joi from 'joi';

export const validateReportInput = (data: any) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    date: Joi.date().optional()
  });

  return schema.validate(data);
};
