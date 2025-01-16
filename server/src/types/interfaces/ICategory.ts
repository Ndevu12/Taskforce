import { Document } from 'mongoose';
import { CategoryType } from '../enums/CategoryType';

export interface ICategory extends Document {
  name: string;
  type: CategoryType;
  user?: string;
  isDefault: boolean;
}
