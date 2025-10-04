export enum AccountType {
  BANK = 'BANK',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CASH = 'CASH',
  CREDIT = 'CREDIT',
  INVESTMENT = 'INVESTMENT',
  OTHER = 'OTHER'
}

export interface Account {
  _id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  accountNumber?: string;
  description?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
  lastTransactionDate?: string;
}

export interface AccountRequestData {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  accountNumber?: string;
  description?: string;
}
