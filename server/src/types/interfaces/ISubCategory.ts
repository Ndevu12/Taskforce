import { Document } from 'mongoose';
import { CategoryType } from '../enums/CategoryType';

export interface ISubCategory extends Document {
  name: string;
  category: string;
  user?: string;
  isDefault: boolean;
  type: CategoryType; // Updated to use CategoryType enum
}
