import { Document } from 'mongoose';

export interface ISubCategory extends Document {
  name: string;
  category: string;
  user?: string;
  isDefault: boolean;
}
