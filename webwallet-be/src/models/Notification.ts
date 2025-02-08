import mongoose, { Document } from 'mongoose';
import { INotification } from '../types/interfaces/INotification';
import { NotificationType } from '../types/enums/NotificationType';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: NotificationType, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  read: { type: Boolean, default: false },
  seen: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', notificationSchema);