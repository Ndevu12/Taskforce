import mongoose, { Document } from 'mongoose';
import { INotification } from '../types/interfaces/INotification';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['BUDGET_THRESHOLD', 'TRANSACTION_ALERT'], required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', notificationSchema);