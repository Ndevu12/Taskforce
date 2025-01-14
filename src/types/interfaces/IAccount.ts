import { Document } from 'mongoose';

export interface IAccount extends Document {
  user: string;
  name: string;
  type: 'BANK' | 'MOBILE_MONEY' | 'CASH';
  balance: number;
  currency: string;
  isActive: boolean;
}
