import mongoose, { Document } from 'mongoose';
import { IAccount } from '../types/interfaces/IAccount';
import { AccountType } from '../types/enums/AccountType';

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(AccountType), required: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IAccount>('Account', accountSchema);
