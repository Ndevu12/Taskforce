import Joi from 'joi';
import { ReportType } from '../../types/enums/ReportType';
import { BudgetPeriod } from '../../types/enums/BudgetPeriod';

export const validateScheduleReportInput = (data: any) => {
  const schema = Joi.object({
    // type: Joi.string().valid(...Object.values(ReportType)).required(),
    type: Joi.string().valid(...Object.values(BudgetPeriod)).required(),
    title: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    data: Joi.object().optional()
  });

  return schema.validate(data);
};
