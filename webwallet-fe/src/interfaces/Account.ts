export enum AccountType {
  BANK = 'BANK',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CASH = 'CASH',
  CREDIT = 'CREDIT',
  OTHER = 'OTHER',
}

export interface Account {
  _id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  accountNumber?: string;
}

export interface AccountRequestData {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  accountNumber?: string;
}
