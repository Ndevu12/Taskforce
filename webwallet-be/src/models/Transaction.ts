import mongoose, { Document } from 'mongoose';
import { ITransaction } from '../types/interfaces/ITransaction';
import { TransactionType } from '../types/enums/TransactionType';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
  type: { type: String, enum: TransactionType, required: true },
  budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);