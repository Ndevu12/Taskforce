import { Document } from 'mongoose';

export interface IBudget extends Document {
  user: string;
  category: string;
  amount: number;
  period: 'MONTHLY' | 'YEARLY';
  startDate: Date;
  currentSpent: number;
  notificationThreshold: number;
}