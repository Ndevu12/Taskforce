import { Document } from 'mongoose';

export interface INotification extends Document {
  user: string;
  type: 'BUDGET_THRESHOLD' | 'TRANSACTION_ALERT';
  message: string;
  read: boolean;
}
