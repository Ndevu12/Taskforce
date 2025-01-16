import mongoose, { Document } from 'mongoose';
import { ReportType } from '../enums/ReportType';

export interface IReport extends Document {
  user: mongoose.Schema.Types.ObjectId;
  schedule: mongoose.Schema.Types.ObjectId;
  data?: object;
}
