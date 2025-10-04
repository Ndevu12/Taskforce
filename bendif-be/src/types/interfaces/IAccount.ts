import { Document } from 'mongoose';
import { AccountType } from '../enums/AccountType';

export interface IAccount extends Document {
  user: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  accountNumber?: string;
}
