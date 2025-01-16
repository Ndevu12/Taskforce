import Joi from 'joi';
import { ReportType } from '../../types/enums/ReportType';

export const validateReportInput = (data: any) => {
  const schema = Joi.object({
    type: Joi.string().valid(...Object.values(ReportType)).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    data: Joi.object().optional()
  });

  return schema.validate(data);
};
