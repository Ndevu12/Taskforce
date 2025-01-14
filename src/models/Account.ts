import mongoose, { Document } from 'mongoose';
import { IAccount } from '../types/interfaces/IAccount';

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['BANK', 'MOBILE_MONEY', 'CASH'], required: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IAccount>('Account', accountSchema);
