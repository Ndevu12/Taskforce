import mongoose from 'mongoose';
import { IBudget } from '../types/interfaces/IBudget';
import { BudgetPeriod } from '../types/enums/BudgetPeriod';

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true },
  period: { type: String, enum: Object.values(BudgetPeriod), required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  currentSpent: { type: Number, default: 0 },
  notificationThreshold: { type: Number, default: 80 },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model<IBudget>('Budget', budgetSchema);