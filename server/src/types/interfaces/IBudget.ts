import { Document } from 'mongoose';
import { BudgetPeriod } from '../enums/BudgetPeriod';

export interface IBudget extends Document {
  user: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  currentSpent: number;
  notificationThreshold: number;
  description?: string;
}
