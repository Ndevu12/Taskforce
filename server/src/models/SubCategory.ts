import mongoose, { Document } from 'mongoose';
import { ISubCategory } from '../types/interfaces/ISubCategory';
import { CategoryType } from '../types/enums/CategoryType';

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDefault: { type: Boolean, default: false },
  type: { type: String, enum: Object.values(CategoryType), required: true } // Updated to use CategoryType enum
}, { timestamps: true });

export default mongoose.model<ISubCategory>('SubCategory', subCategorySchema);