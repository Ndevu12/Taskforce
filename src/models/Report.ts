import mongoose, { Document } from 'mongoose';
import { IReport } from '../types/interfaces/IReport';

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['SUMMARY', 'CATEGORY_ANALYSIS', 'BUDGET_STATUS'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  data: { type: Object },
}, { timestamps: true });

export default mongoose.model<IReport>('Report', reportSchema);