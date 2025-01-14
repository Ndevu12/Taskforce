import { Document } from 'mongoose';

export interface IReport extends Document {
  user: string;
  type: 'SUMMARY' | 'CATEGORY_ANALYSIS' | 'BUDGET_STATUS';
  startDate: Date;
  endDate: Date;
  data?: object;
}
