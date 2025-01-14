import { Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  user?: string;
  isDefault: boolean;
}
