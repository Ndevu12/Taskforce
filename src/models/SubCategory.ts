import mongoose, { Document } from 'mongoose';
import { ISubCategory } from '../types/interfaces/ISubCategory';

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<ISubCategory>('SubCategory', subCategorySchema);