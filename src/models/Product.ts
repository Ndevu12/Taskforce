import mongoose from 'mongoose';
import { IProduct } from '../types/interfaces/IProduct';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', productSchema);