import mongoose from 'mongoose';
import { IReport } from '../types/interfaces/IReport';

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'ReportSchedule', required: true },
  data: { type: Object, required: true },
}, { timestamps: true });

export default mongoose.model<IReport>('Report', reportSchema);
