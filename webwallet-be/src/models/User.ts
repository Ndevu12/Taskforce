import mongoose from 'mongoose';
import { IUser } from '../types/interfaces/IUser';
import { UserRole } from '../types/enums/UserRole';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: UserRole },
  preferences: {
    defaultCurrency: { type: String, default: 'RWF' },
    notificationSettings: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      budgetAlerts: { type: Boolean, default: true },
    },
    theme: { type: String, default: 'light' }
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationExpires: { type: Date, default: null },
  resetToken: { type: String, default: null },
  resetTokenExpires: { type: Date, default: null },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);