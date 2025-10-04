import { Document } from 'mongoose';

export interface ITransaction extends Document {
  user: string;
  account: string;
  category: string;
  subCategory?: string[];
  amount: number;
  description?: string;
  date: Date;
  budget: string;
}