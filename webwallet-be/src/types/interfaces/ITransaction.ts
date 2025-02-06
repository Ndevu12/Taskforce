import { Document } from 'mongoose';

export interface ITransaction extends Document {
  user: string;
  account: string;
  category: string;
  subCategory?: string[];
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description?: string;
  date: Date;
}