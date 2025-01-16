import mongoose, { Document } from 'mongoose';
import { ICategory } from '../types/interfaces/ICategory';
import { CategoryType } from '../types/enums/CategoryType';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(CategoryType), required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<ICategory>('Category', categorySchema);