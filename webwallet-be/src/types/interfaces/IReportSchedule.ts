import { Document } from 'mongoose';
import { BudgetPeriod } from '../enums/BudgetPeriod';

export interface IReportSchedule extends Document {
  user: string;
  type: BudgetPeriod;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
}
