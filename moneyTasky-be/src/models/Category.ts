import mongoose, { Document } from 'mongoose';
import { ICategory } from '../types/interfaces/ICategory';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ICategory>('Category', categorySchema);