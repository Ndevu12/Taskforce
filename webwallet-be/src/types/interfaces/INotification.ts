import { Document } from 'mongoose';
import { NotificationType } from '../enums/NotificationType';

export interface INotification extends Document {
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}
