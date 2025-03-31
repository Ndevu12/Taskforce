
import { Document } from 'mongoose';
import { UserRole } from '../enums/UserRole';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  verificationExpires: Date | null;
  verificationToken: string | null;
  isVerified: boolean;
  resetToken: string | null;
  resetTokenExpires: Date | null;
  preferences: {
    defaultCurrency: string;
    notificationSettings: {
      email: boolean;
      push: boolean;
      budgetAlerts: boolean;
    };
    theme: string;
  };
  lastLogin: Date | null;
}