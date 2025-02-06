import mongoose from 'mongoose';
import { IReportSchedule } from '../types/interfaces/IReportSchedule';
import { BudgetPeriod } from '../types/enums/BudgetPeriod';

const reportScheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: Object.values(BudgetPeriod), required: true },
  title: { type: String, required: true },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model<IReportSchedule>('ReportSchedule', reportScheduleSchema);
